import * as Core from "../core"

interface BinderResult {
    status: "Next" | "Exit",
    result?: any[]
}

interface BinderCommand {
    getParameters(): BinderResult;
}

function convert(source: string) {
    if (!isNaN(+source))
        return parseInt(source);
    else if (source.toLowerCase() === "true" || source.toLowerCase() === "false")
        return source.toLowerCase() === "true";
    else return source;
}

export class ParameterBinder {


    private commands: BinderCommand[] = []
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) {
        //priorities
        this.commands = [
            new ApiConventionParameterBinder(this.routeInfo, this.request),
            new DefaultParameterBinder(this.routeInfo, this.request),
        ]
    }

    getParameters(): Array<any> {
        for (let command of this.commands) {
            let commandResult = command.getParameters();
            if (commandResult.status == "Exit")
                return commandResult.result;
        }
    }
}

class DefaultParameterBinder {
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) { }

    getParameters(): BinderResult {
        let result: any[] = []
        let routeParams = this.routeInfo.route
            .split("/")
            .filter(x => x.charAt(0) == ":")
            .map(x => x.substring(1))
        for (let item of routeParams) {
            result.push(convert(this.request.getParam(item)))
        }
        return { status: "Exit", result: result };
    }
}

class ApiConventionParameterBinder {
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) { }

    getParameters(): BinderResult {
        if (this.routeInfo.initiator == "ApiConvention") {
            let routeParams = this.routeInfo.route
                .split("/")
                .filter(x => x.charAt(0) == ":")
                .map(x => x.substring(1))

            switch (this.routeInfo.httpMethod) {
                case "GET":
                case "DELETE":
                    return { status: "Next" };
                case "PUT":
                    let result = [];
                    result.push(convert(this.request.getParam(routeParams[0])))
                    result.push(this.request.body)
                    return { status: "Exit", result: result };
                case "POST":
                    return { status: "Exit", result: [this.request.body] };
            }
        }
        else return { status: "Next" }
    }
}