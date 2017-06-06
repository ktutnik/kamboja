import * as Path from "path"
import { PathResolver } from "../core"

export class DefaultPathResolver {
    constructor(private rootPath:string){}

    /**
     * Resolve path from relative to absolute
     */
    resolve(path: string) {
        return Path.join(this.rootPath, path);
    }

    /**
     * Convert absolute path to relative to process.cwd()
     */
    relative(absolute: string) {
        return Path.relative(this.rootPath, absolute);
    }

    /**
     * Normalize path to qualified name path
     */
    normalize(path: string) {
        if (Path.isAbsolute(path)) {
            path = this.relative(path)
        }
        let raw = Path.parse(path)
        return Path.join(raw.dir, raw.name)
    }
}