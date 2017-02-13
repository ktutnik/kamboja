import * as Path from "path"

export class PathResolver{
    resolve(path:string){
        return Path.join(process.cwd(), path);
    }

    relative(absolute:string){
        return Path.relative(process.cwd(), absolute);
    }

    static normalize(path:string){
        let raw = Path.parse(path)
        return Path.join(raw.dir, raw.name)
    }
}