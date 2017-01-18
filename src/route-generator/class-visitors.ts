import { Generator, ClassVisitor, RouteInfo } from "../core"
import { MetaData } from "kenanga"

export class ClassVisitorBase {
    constructor(public generator: Generator) { }
    traverseAndFixClassName(meta: MetaData, route) {
        let result = this.generator.traverseArray(meta.children, route);
        result.forEach(x => {
            if (x.className.charAt(0) == ",")
                x.className = meta.name + x.className;
            else
                x.className = meta.name + "." + x.className;
        })
        return result;
    }
}

export class ControllerStriperVisitor extends ClassVisitorBase implements ClassVisitor {
    constructor(generator: Generator) {
        super(generator)
    }
    visit(meta: MetaData, parent: string) {
        let ctlLocation = meta.name.toLowerCase().lastIndexOf("controller");
        if (ctlLocation > -1) {
            let name = meta.name.substr(0, ctlLocation);
            parent += "/" + name.toLowerCase();
            return this.traverseAndFixClassName(meta, parent);
        }
        else return null;
    }
}

export class ModuleOrClassVisitor extends ClassVisitorBase implements ClassVisitor {
    constructor(generator: Generator) {
        super(generator)
    }
    visit(meta: MetaData, parent: string) {
        parent += "/" + meta.name.toLowerCase();
        return this.traverseAndFixClassName(meta, parent);
    }
}