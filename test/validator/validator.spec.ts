import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { Validator } from "../../src/validator/validator"
import { DefaultIdentifierResolver } from "../../src/resolver"
import { MetaDataStorage } from "../../src/metadata-storage"
import { RequiredValidator } from "../../src/validator"

describe("Validator", () => {
    it("Should return error message when provided null", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.getByPage = function (age, name) {
                };
                return MyClass;
            }(controller_1.Controller));
            tslib_1.__decorate([
                tslib_1.__param(0, src_1.val.required()),
                tslib_1.__param(1, src_1.val.required()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
    })

})