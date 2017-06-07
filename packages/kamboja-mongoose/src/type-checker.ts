import { Resolver, Core } from "kamboja"
import * as H from "./helper"

export class TypeChecker {
    private name: string;
    private qualified: boolean
    private array: boolean = false
    private valid: boolean = false;

    constructor(private type: string, pathResolver:Core.PathResolver) {
        if (type) {
            let qualified = new Resolver.QualifiedName(type, pathResolver)
            this.qualified = qualified.isValid()
            if (this.qualified) {
                this.name = H.getName(qualified.className);
                this.valid = true
                this.array = qualified.isArray()
            }
            else {
                if (type.indexOf("[]", type.length - 2) > -1) {
                    this.array = true
                    this.name = type.substr(0, type.length - 2).toLowerCase()
                }
                else this.name = type.toLowerCase();
                if (Core.ValidationTypesAccepted
                    .some(x => this.name.toLowerCase() == x)) {
                    this.valid = true
                }
            }
        }
    }

    isValid() { return this.valid }
    isArray() { return this.array }
    isQualifiedName() { return this.qualified }
    getName() { return this.name }
}