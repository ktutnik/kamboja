
export interface BinderResult {
    status: "Next" | "Exit",
    result?: any[]
}

export interface BinderCommand {
    getParameters(): BinderResult;
}

export function autoConvert(source: string) {
    if (!isNaN(+source))
        return parseInt(source);
    else if (source.toLowerCase() === "true" || source.toLowerCase() === "false")
        return source.toLowerCase() === "true";
    else return source;
}