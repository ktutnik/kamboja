import { MetaData, ParentMetaData, MetadataType, MethodMetaData, ClassMetaData } from "kecubung";
import * as Core from "../core"
import * as Path from "path"
import { QualifiedName } from "../resolver/qualified-name"
import { PathResolver } from "../resolver/path-resolver"

export class InMemoryMetaDataStorage {
    private storage: ParentMetaData[] = []

    constructor(private idResolver: Core.IdentifierResolver) { }

    save(meta: ParentMetaData) {
        let file = this.storage
            .filter(x => PathResolver.normalize(x.name) == PathResolver.normalize(meta.name))
        if (!file || file.length == 0)
            this.storage.push(meta)
    }

    get(classId: string) {
        let qualifiedName = this.idResolver.getClassName(classId)
        let classInfo = new QualifiedName(qualifiedName)
        let file = this.storage
            .filter(x => PathResolver.normalize(x.name) == classInfo.fileName)[0]
        if(!file) return
        let result: MetaData = file;
        for (let className of classInfo.className.split(".")) {
            for (let item of (<ParentMetaData>result).children) {
                if (item.name == className) {
                    if (item.type == "Class") {
                        return <ClassMetaData>item
                    }
                    else {
                        result = item;
                        break;
                    }
                }
            }
        }
    }

}