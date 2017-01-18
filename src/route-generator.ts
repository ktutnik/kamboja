import { MetaData, AnalysisType } from "kenanga"
import { Decorator, HttpDecorator, RouteInfo, GeneratorOption, RouteAnalysis, HttpMethod } from "./core"

import * as Path from "path"

export type DecoratorType = keyof Decorator | keyof HttpDecorator;

export interface MethodVisitor {
    visit(meta: MetaData, parent: string): MethodVisitorResult;
}

export type VisitStatus = "Complete" | "NextWithAnalysis" | "Next" | "Exit"

export interface MethodVisitorResult {
    status: VisitStatus
    result?: RouteInfo
}

export interface ClassVisitor {
    visit(meta: MetaData, parent: string): RouteInfo[]
}

export interface Generator {
    fileName: string,
    traverseArray(children: MetaData[], parent: string): RouteInfo[];
    traverseMeta(meta: MetaData, parent: string): RouteInfo[];
}

export class RouteGenerator implements Generator {
    private classVisitors: Array<ClassVisitor> = []
    private methodVisitors: Array<MethodVisitor> = []
    fileName: string;

    constructor(private meta: MetaData, option?: GeneratorOption) {
        let opt = this.getOption(option);
        this.fileName = meta.name;
        if (opt.stripeController)
            this.classVisitors.push(new ControllerStriperVisitor(this))
        this.classVisitors.push(new ClassVisitor(this))
        //visitor order, the most important put it at the top
        if (opt.internalDecorator)
            this.methodVisitors.push(new MethodWithInternalDecoratorVisitor(this))
        if (opt.httMethodDecorator)
            this.methodVisitors.push(new MethodWithHttpDecoratorVisitor(this))
        if (opt.apiConvention)
            this.methodVisitors.push(new ConventionOverConfigurationMethodVisitor(this))
        this.methodVisitors.push(new DefaultMethodVisitor(this))
    }

    private getOption(opt: GeneratorOption): GeneratorOption {
        let defaultOpt: GeneratorOption = {
            stripeController: true,
            internalDecorator: true,
            httMethodDecorator: true,
            apiConvention: false
        }
        for (let key in opt) {
            defaultOpt[key] = opt[key]
        }
        return defaultOpt;
    }


    traverseArray(children: MetaData[], parent: string) {
        let result: RouteInfo[] = [];
        for (let child of children) {
            let traverseResult = this.traverseMeta(child, parent)
            if (traverseResult && traverseResult.length > 0)
                result = result.concat(traverseResult)
        }
        return result;
    }

    traverseMeta(meta: MetaData, parent: string) {
        if ((meta.analysis & AnalysisType.Valid) != AnalysisType.Valid)
            return null;

        switch (meta.type) {
            case "Class":
            case "Module":
                return this.classVisitorAggregate(meta, parent);
            case "Method":
                return this.methodVisitorAggregate(meta, parent);
            default:
                return this.traverseArray(meta.children, parent);
        }
    }

    private classVisitorAggregate(meta: MetaData, parent: string) {
        for (let visitor of this.classVisitors) {
            let result = visitor.visit(meta, parent)
            if (result) return result;
        }
    }

    private methodVisitorAggregate(meta: MetaData, parent: string) {
        let analysis: RouteAnalysis[] = []
        for (let visitor of this.methodVisitors) {
            let result = visitor.visit(meta, parent)
            switch (result.status) {
                case "Complete":
                    result.result.analysis = analysis.concat(result.result.analysis)
                    return [result.result];
                case "NextWithAnalysis":
                    analysis = analysis.concat(result.result.analysis)
                case "Exit":
                    return null;
            }
        }
    }

    getRoutes() {
        return this.traverseMeta(this.meta, "")
    }
}


export class ClassVisitorBase {
    constructor(public generator: Generator) { }
    traverseAndFixClassName(meta: MetaData, route) {
        let result = this.generator.traverseArray(meta.children, route);
        result.forEach(x => {
            if (x.className.charAt(0) == ",")
                x.className = meta.name + x.className;
            else
                x.className = meta.name + "." + x.className;
        })
        return result;
    }
}

export class ControllerStriperVisitor extends ClassVisitorBase implements ClassVisitor {
    constructor(generator: Generator) {
        super(generator)
    }
    visit(meta: MetaData, parent: string) {
        let ctlLocation = meta.name.toLowerCase().lastIndexOf("controller");
        if (ctlLocation > -1) {
            let name = meta.name.substr(0, ctlLocation);
            parent += "/" + name.toLowerCase();
            return this.traverseAndFixClassName(meta, parent);
        }
        else return null;
    }
}

export class ClassVisitor extends ClassVisitorBase implements ClassVisitor {
    constructor(generator: Generator) {
        super(generator)
    }
    visit(meta: MetaData, parent: string) {
        parent += "/" + meta.name.toLowerCase();
        return this.traverseAndFixClassName(meta, parent);
    }
}

export class MethodVisitorBase {
    constructor(public generator: Generator) { }
    complete(meta: MetaData, route, method: HttpMethod, analysis?: RouteAnalysis[]): MethodVisitorResult {
        let fileName = this.generator.fileName;
        if (Path.extname(fileName) == ".js") {
            fileName = fileName.slice(0, -3);
        }
        return {
            status: "Complete",
            result: {
                route: route,
                method: method,
                className: `, ${fileName}`,
                parameters: meta.children.map(x => x.name),
                analysis: analysis || []
            }
        };
    }

    nextWithAnalysis(analysis: RouteAnalysis[]): MethodVisitorResult {
        return {
            status: "NextWithAnalysis",
            result: {
                route: "",
                method: "GET",
                className: "",
                parameters: [],
                analysis: analysis || []
            }
        }
    }

    next(): MethodVisitorResult {
        return { status: "Next" };
    }

    exit(): MethodVisitorResult {
        return { status: "Exit" };
    }
}

export class DefaultMethodVisitor extends MethodVisitorBase implements MethodVisitor {
    constructor(generator: Generator) {
        super(generator)
    }
    visit(meta: MetaData, parent: string) {
        parent += "/" + meta.name.toLowerCase();
        meta.children.forEach(x => parent += `/:${x.name}`)
        return this.complete(meta, parent, "GET");
    }
}

export class MethodWithInternalDecoratorVisitor extends MethodVisitorBase implements MethodVisitor {
    constructor(generator: Generator) {
        super(generator)
    }
    visit(meta: MetaData, parent: string) {
        if (meta.decorators && meta.decorators.length > 0) {
            for (let decorator of meta.decorators) {
                let name = <DecoratorType>decorator.name;
                if (name == "internal") return this.exit()
            }
        }
        return this.next();
    }
}

export class MethodWithHttpDecoratorVisitor extends MethodVisitorBase implements MethodVisitor {
    private decorators: Array<DecoratorType> = ["get", "put", "post", "delete"]
    constructor(generator: Generator) {
        super(generator)
    }

    visit(meta: MetaData, parent: string) {
        if (meta.decorators && meta.decorators.length > 0) {
            let decorators = meta.decorators.filter(x => this.decorators.some(y => y == x.name))
            let analysis: RouteAnalysis[] = [];
            if (decorators.length != 1) {
                analysis.push({
                    type: "Error",
                    message: `Error ${this.generator.fileName} line ${meta.location.line}: method ${meta.name} contains multiple decorators`
                })
                return this.nextWithAnalysis(analysis);
            }

            //analyse if provided has associated parameter
            let route = decorators[0].children[0].name;
            let method = <HttpMethod>decorators[0].name.toUpperCase();
            let parameters = meta.children.map(x => x.name);
            let tokens = route.split("/");
            for (let x of tokens) {
                if (x && x.charAt(0) == ":") {
                    let parName = x.substring(1);
                    if (!parameters.some(y => y == parName)) {
                        analysis.push({
                            type: "Error",
                            message: `Error ${this.generator.fileName} line ${meta.location.line}: route parameter ${parName} in ${route} doesn't have associated parameter in method ${meta.name}`
                        })
                        return this.nextWithAnalysis(analysis);
                    }
                }
            }

            return this.complete(meta, route, method, analysis);
        }
        else return this.next()
    }
}

export type MethodConventionType = "getByPage" | "get" | "add" | "modify" | "delete"

export class ConventionOverConfigurationMethodVisitor extends MethodVisitorBase implements MethodVisitor {
    private conventions: Array<MethodConventionType> = ["getByPage", "get", "add", "modify", "delete"]

    constructor(generator: Generator) {
        super(generator)
    }

    visit(meta: MetaData, parent: string) {
        if (this.conventions.some(x => x == meta.name)) {
            let name = <MethodConventionType>meta.name;
            switch (name) {
                case "getByPage":
                    return this.getByPage(meta, parent);
                case "get":
                    return this.singleParam(meta, parent, "GET");
                case "delete":
                    return this.singleParam(meta, parent, "DELETE");
                case "modify":
                    return this.singleParam(meta, parent, "PUT");
                case "add":
                    return this.add(meta, parent);
            }
        }
        return this.next()
    }

    private getByPage(meta: MetaData, parent: string) {
        let analysis: RouteAnalysis[] = []
        if (meta.children.length < 1) {
            analysis.push({
                type: "Warning",
                message: `Warning ${this.generator.fileName} line ${meta.location.line}: Convention fail, no parameters found on getByPage method`
            })
            return this.nextWithAnalysis(analysis);
        }
        else {
            parent += "/page";
            meta.children.forEach(x => parent += `/:${x.name}`)
            return this.complete(meta, parent, "GET");
        }
    }

    private singleParam(meta: MetaData, parent: string, method: HttpMethod) {
        let analysis: RouteAnalysis[] = []
        if (meta.children.length < 1) {
            analysis.push({
                type: "Warning",
                message: `Warning ${this.generator.fileName} line ${meta.location.line}: Convention fail, no parameters found on ${meta.name} method`
            })
            return this.nextWithAnalysis(analysis);
        }
        meta.children.forEach(x => parent += `/:${x.name}`)
        return this.complete(meta, parent, method);
    }

    private add(meta: MetaData, parent: string) {
        return this.complete(meta, parent, "POST");
    }
}

