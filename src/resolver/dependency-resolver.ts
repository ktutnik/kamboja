import * as Core from "../core"
import { PathResolver } from "./path-resolver"

export class DefaultDependencyResolver implements Core.DependencyResolver {
    pathResolver = new PathResolver();

    resolve<T>(id: string) {
        let parts = id.split(",")
        if (parts.length != 2) throw new Error("Provided class name is not qualified")
        let classParts = parts[0].trim().split(".")
        let modulePath = parts[1].trim()
        let instance = require(this.pathResolver.resolve(modulePath))
        classParts.forEach(x => instance = instance[x])
        return <T>new instance();
    }
}