import * as Core from "kamboja-core"

export class DefaultIdentifierResolver implements Core.IdentifierResolver {
    getClassId(qualifiedClassName: string) {
        return qualifiedClassName;
    }

    getClassName(classId:string){
        return classId;
    }
}