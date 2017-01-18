import { Generator, HttpMethod, RouteAnalysis, MethodVisitorResult, MethodVisitor, Decorator, HttpDecorator } from "../core"
import { MetaData } from "kenanga"
import * as Path from "path"

export type DecoratorType = keyof Decorator | keyof HttpDecorator;
export type MethodConventionType = "getByPage" | "get" | "add" | "modify" | "delete"

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
    private decorators: Array<DecoratorType> = ["get", "put", "post", "delete", "internal"]
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
            //analyse if provided has associated parameter
            let analysis: RouteAnalysis[] = [];
            let decorators = meta.decorators.filter(x => this.decorators.some(y => y == x.name))
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