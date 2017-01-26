import * as path from "path"

/**
 * Qualified Class Fullname:
 * <module>.<module>.<class>, <path relative to root project>
 * example: 
 * "MyModule.InnerModule.MyClass, ./controller/my-class"
 */
export function getInstance<T>(qualifiedClassName: string) {
    let parts = qualifiedClassName.split(",")
    if (parts.length != 2) throw new Error("Provided class name is not qualified")
    let classParts = parts[0].trim().split(".")
    let modulePath = parts[1].trim()
    let instance = require(path.join(process.cwd(), modulePath))
    classParts.forEach(x => instance = instance[x])
    return <T>new instance();
}

export function override<T>(override:T, defaultOptions:T):T {
    for (let key in override) {
        defaultOptions[key] = override[key]
    }
    return defaultOptions;
}

export function copy(source, destination, lowerCaseKey = true) {
    for (let key in source) {
        if(lowerCaseKey)key = key.toLowerCase()
        destination[key] = source[key]
    }
}