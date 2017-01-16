import * as ModulUtils from "./module-utils"

export interface DependencyResolver{
    resolve(qualifiedClassName:string)
}

export class DefaultDependencyResolver implements DependencyResolver{
    resolve(qualifiedClassName:string){
        return ModulUtils.getInstance(qualifiedClassName)
    }
}