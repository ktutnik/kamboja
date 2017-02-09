import { MetaData, ParentMetaData, MetadataType, MethodMetaData, ClassMetaData } from "kecubung";
import {IdentifierResolver} from "../core"

export class MetaDataStorage {
    static storage: ParentMetaData[] = []

    constructor(private idResolver:IdentifierResolver){}

    save(meta: ParentMetaData) {
        let file = MetaDataStorage.storage
            .filter(x => this.cleanupFileName(x.name) == this.cleanupFileName(meta.name))
        if (!file || file.length == 0)
            MetaDataStorage.storage.push(meta)
    }

    get(classId: string) {
        let qualifiedName = this.idResolver.getClassName(classId)
        let tokens = qualifiedName.split(",")
        if (tokens.length != 2) throw new Error(`[${qualifiedName}] is not a qualified name`)
        let classNames = tokens[0].trim().split(".")
        let fileName = this.cleanupFileName(tokens[1].trim())
        let file = MetaDataStorage.storage
            .filter(x => this.cleanupFileName(x.name) == fileName)[0]
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

    cleanupFileName(fileName: string) {
        //TODO: not windows friendly
        if (fileName.indexOf(".") == 0) {
            fileName = fileName.substring(1)
        }
        if (fileName.indexOf("/") == 0) {
            fileName = fileName.substring(1)
        }
        if (fileName.toLowerCase().indexOf(".js") > 0) {
            fileName = fileName.substr(0, fileName.length - 3)
        }
        return fileName
    }

}