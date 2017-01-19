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
                analysis: analysis
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
            if (decorators.length != 1) {
                return this.nextWithAnalysis([{
                    type: "Error",
                    message: `Error ${this.generator.fileName} line ${meta.location.line}: method ${meta.name} contains multiple decorators`
                }]);
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
            let decorators = meta.decorators.filter(x => this.decorators.some(y => y == x.name))
            let route = decorators[0].children[0].name;
            let method = <HttpMethod>decorators[0].name.toUpperCase();

            let routeAnalysis = this.checkIfRouteHasParamsButMethodDoesNot(meta, route)
            if (routeAnalysis) return this.nextWithAnalysis([routeAnalysis])

            routeAnalysis = this.checkIfMethodHasParamsButRouteDoesNot(meta, route, method)
            if (routeAnalysis) return this.nextWithAnalysis([routeAnalysis])

            let analysis = this.checkParameterAssociation(meta, route);
            if (analysis.length > 0) return this.nextWithAnalysis(analysis);

            return this.complete(meta, route, method);
        }
        else return this.next()
    }

    private checkIfRouteHasParamsButMethodDoesNot(meta: MetaData, route: string) {
        //analyse if route contains parameter but method without parameter
        let analysis: RouteAnalysis[] = [];
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        if (routeParameters.length > 0 && meta.children.length == 0) {
            return <RouteAnalysis>{
                type: "Error",
                message: `Error ${this.generator.fileName} line ${meta.location.line}: route contains parameters but ${meta.name} method doesn't`
            }
        }
        return null;
    }

    private checkIfMethodHasParamsButRouteDoesNot(meta: MetaData, route: string, method:string) {
        //analyse if method contains parameter but route without parameter
        //this check only work for GET method, because other method can pass a BODY to the parameter
        let analysis: RouteAnalysis[] = [];
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        if (method == "GET" && routeParameters.length == 0 && meta.children.length > 0) {
            return <RouteAnalysis>{
                type: "Error",
                message: `Error ${this.generator.fileName} line ${meta.location.line}: method ${meta.name} contains parameters but route doesn't`
            }
        }
        return null;
    }

    private checkParameterAssociation(meta: MetaData, route: string) {
        //analyse if provided has associated parameter
        let analysis: RouteAnalysis[] = [];
        let parameters = meta.children.map(x => x.name);
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        for (let x of routeParameters) {
            let parName = x.substring(1);
            if (!parameters.some(y => y == parName)) {
                analysis.push({
                    type: "Error",
                    message: `Error ${this.generator.fileName} line ${meta.location.line}: route parameter ${parName} in ${route} doesn't have associated parameter in method ${meta.name}`
                })
            }
        }
        return analysis;
    }
}


export class ConventionOverConfigurationMethodVisitor extends MethodVisitorBase implements MethodVisitor {
    private conventions: Array<MethodConventionType> = ["getByPage", "get", "add", "modify", "delete"]

    constructor(generator: Generator) {
        super(generator)
    }

    visit(meta: MetaData, parent: string) {
        if (this.conventions.some(x => x == meta.name)) {
            if (meta.children.length < 1) {
                return this.nextWithAnalysis([{
                    type: "Warning",
                    message: `Warning ${this.generator.fileName} line ${meta.location.line}: Convention fail, no parameters found on ${meta.name} method`
                }]);
            }
            switch (<MethodConventionType>meta.name) {
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
        parent += "/page";
        meta.children.forEach(x => parent += `/:${x.name}`)
        return this.complete(meta, parent, "GET");
    }


    private singleParam(meta: MetaData, parent: string, method: HttpMethod) {
        parent += "/:" + meta.children[0].name;
        return this.complete(meta, parent, method);
    }

    private add(meta: MetaData, parent: string) {
        return this.complete(meta, parent, "POST");
    }
}