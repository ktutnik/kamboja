import * as Path from "path"

export class PathResolver {

    /**
     * Resolve path from relative to absolute
     */
    resolve(path: string) {
        return Path.join(process.cwd(), path);
    }

    /**
     * Convert absolute path to relative to process.cwd()
     */
    relative(absolute: string) {
        return Path.relative(process.cwd(), absolute);
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