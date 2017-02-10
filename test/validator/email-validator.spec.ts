import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { EmailValidator } from "../../src/validator/email-validator"

describe("EmailValidator", () => {
    it("Should return undefined if provided correct value", () => {
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
                tslib_1.__param(0, src_1.val.email()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new EmailValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate("username@host.com", clazz.methods[0].parameters[0])
        Chai.expect(result).undefined
    })

    it("Should return provide parent name on the field", () => {
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
                tslib_1.__param(0, src_1.val.email()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new EmailValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate("not_an_email", clazz.methods[0].parameters[0], "parent")
        Chai.expect(result[0].field).eq("parent.model")
    })

    it("Should return error message when string length less then specified", () => {
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
                tslib_1.__param(0, src_1.val.email()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new EmailValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate("not_an_email", clazz.methods[0].parameters[0])
        Chai.expect(result[0].field).eq("model")
        Chai.expect(result[0].message).contain("not a valid email address")
    })

    it("Should able to use custom message", () => {
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
                tslib_1.__param(0, src_1.val.email("Not valid email")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new EmailValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate("not_an_email", clazz.methods[0].parameters[0])
        Chai.expect(result[0].field).eq("model")
        Chai.expect(result[0].message).eq("Not valid email")
    })
})