import { MetaData, ParentMetaData, MetadataType, MethodMetaData, ClassMetaData } from "kecubung";
import * as Core from "../core"
import * as Path from "path"

export class MetaDataStorage {
    private storage: ParentMetaData[] = []

    constructor(private idResolver:Core.IdentifierResolver){}

    save(meta: ParentMetaData) {
        let file = this.storage
            .filter(x => Path.normalize(x.name) == Path.normalize(meta.name))
        if (!file || file.length == 0)
            this.storage.push(meta)
    }

    get(classId: string) {
        let qualifiedName = this.idResolver.getClassName(classId)
        let tokens = qualifiedName.split(",")
        if (tokens.length != 2) throw new Error(`[${qualifiedName}] is not a qualified name`)
        let classNames = tokens[0].trim().split(".")
        let fileName = Path.normalize(tokens[1].trim())
        let file = this.storage
            .filter(x => Path.normalize(x.name) == fileName)[0]
        let result: MetaData = file;
        for (let className of classNames) {
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