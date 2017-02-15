import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { Validator } from "../../src/validator/validator"
import { DefaultIdentifierResolver } from "../../src/resolver"
import { MetaDataStorage } from "../../src/metadata-storage"
import { RequiredValidator } from "../../src/validator"

describe("Validator", () => {
    let storage: MetaDataStorage;
    let validators = [
        new RequiredValidator()
    ]

    beforeEach(() => {
        storage = new MetaDataStorage(new DefaultIdentifierResolver())
    })

    it("Should return undefined when provided correct value", () => {
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
        let test = new Validator(storage, validators)
        test.setValue([20, "Nobita"],clazz.methods[0])
        let isValid = test.isValid();
        let result = test.getValidationErrors();
        Chai.expect(result).undefined
        Chai.expect(isValid).true
    })

    it("Should return messages when provided incorrect value", () => {
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
        let test = new Validator(storage, validators)
        test.setValue([null, null],clazz.methods[0])
        test.isValid();
        let result = test.getValidationErrors();
        Chai.expect(result[0].field).eq("age")
        Chai.expect(result[0].message).contain("required")
        Chai.expect(result[1].field).eq("name")
        Chai.expect(result[1].message).contain("required")
    })
})