import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { RequiredValidator } from "../../src/validator/required-validator"

describe("RequireValidator", () => {
    it("Should return error message when provided null", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.getByPage = function (model) {
                };
                return MyClass;
            }(controller_1.Controller));
            tslib_1.__decorate([
                tslib_1.__param(0, src_1.val.required()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new RequiredValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate(null, clazz.methods[0].parameters[0])
        Chai.expect(result[0].field == "model")
        Chai.expect(result[0].message).contain("required")
    })

    it("Should return undefined when provided a value", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.getByPage = function (model) {
                };
                return MyClass;
            }(controller_1.Controller));
            tslib_1.__decorate([
                tslib_1.__param(0, src_1.val.required()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new RequiredValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate(100, clazz.methods[0].parameters[0])
        Chai.expect(result).undefined
    })

    it("Should be able to show custom message", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.getByPage = function (model) {
                };
                return MyClass;
            }(controller_1.Controller));
            tslib_1.__decorate([
                tslib_1.__param(0, src_1.val.required("Hey you must fill this")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new RequiredValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate(null, clazz.methods[0].parameters[0])
        Chai.expect(result[0].field == "model")
        Chai.expect(result[0].message).eq("Hey you must fill this")
    })
})