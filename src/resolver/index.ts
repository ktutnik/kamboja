import * as Utils from "../utils"
import * as Core from "../core"


export class DefaultResolver implements Core.DependencyResolver {
    resolve<T>(id: string) {
        return Utils.getInstance(id);
    }
    getClassId(qualifiedClassName: string, objectInstance: any) {
        return qualifiedClassName;
    }
}