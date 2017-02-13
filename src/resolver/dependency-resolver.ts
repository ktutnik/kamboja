import * as Core from "../core"
import { PathResolver } from "./path-resolver"
import { QualifiedName } from "./qualified-name"

export class DefaultDependencyResolver implements Core.DependencyResolver {
    pathResolver = new PathResolver();

    constructor(private idResolver:Core.IdentifierResolver){}

    resolve<T>(id: string) {
        let name = this.idResolver.getClassName(id)
        let qualified = new QualifiedName(name)
        let instance = require(this.pathResolver.resolve(qualified.fileName))
        let classParts = qualified.className.split(".")
        classParts.forEach(x => instance = instance[x])
        return <T>new instance();
    }
}