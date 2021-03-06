export function autoConvert(source: string) {
    if(typeof source == "undefined" || source == null) return;
    if (!isNaN(+source))
        return parseFloat(source);
    else if (source.toLowerCase() === "true" || source.toLowerCase() === "false")
        return source.toLowerCase() === "true";
    else return source;
}