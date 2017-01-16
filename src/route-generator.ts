import {MetaData} from "kenanga"

export class RouteGenerator{
    constructor(private meta:MetaData){}

    private traverseArray(list:MetaData[], parent:string){
        let result:string[] = [];
        list.forEach(x => {
            let route = this.traverseMeta(x, parent)
            result.concat
        })
    }

    private traverseMeta(meta:MetaData, parent:string):string[]{
        if(meta.children.length > 0){
            let result = this.traverseMeta()
        }
    }
}