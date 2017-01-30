import * as Path from "path"

export class PathResolver{
    resolve(path:string){
        return Path.join(process.cwd(), path);
    }

    relative(absolute:string){
        return Path.relative(process.cwd(), absolute);
    }
}