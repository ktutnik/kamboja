import * as Core from "kamboja-core"
import { DefaultPathResolver } from "./path-resolver"
import { QualifiedName } from "./qualified-name"

export class DefaultDependencyResolver implements Core.DependencyResolver {

    constructor(private idResolver: Core.IdentifierResolver, private pathResolver: Core.PathResolver) { }

    resolve<T>(id: string) {
        let name = this.idResolver.getClassName(id)
        let qualified = new QualifiedName(name, this.pathResolver)
        let instance = require(this.pathResolver.resolve(qualified.fileName))
        let classParts = qualified.className.split(".")
        classParts.forEach(x => instance = instance[x])
        return <T>new instance();
    }
}