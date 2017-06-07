import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { ObjectIdValidator } from "../../src/validator/objectid-validator"
import {Types} from "mongoose"

describe("ObjectIdValidator", () => {
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
                tslib_1.__param(0, src_1.val.objectid()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let ID = new Types.ObjectId()
    
        let test = new ObjectIdValidator();
        let clazz = <Kecubung.ClassMetaData>meta[0]
        let result = test.validate({
            value: ID.toHexString(),
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model"
        })
        Chai.expect(result).undefined
    })

    it("Should not error if provided null", () => {
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
                tslib_1.__param(0, src_1.val.objectid()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ObjectIdValidator();
        let clazz = <Kecubung.ClassMetaData>meta[0]
        let result = test.validate({
            value: null,
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model"
        })
        Chai.expect(result).undefined
    })

    it("Should validate properly", () => {
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
                tslib_1.__param(0, src_1.val.objectid()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ObjectIdValidator();
        let clazz = <Kecubung.ClassMetaData>meta[0]
        let result = test.validate({
            value: "123-5",
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model"
        })
        Chai.expect(result[0].field).eq("model")
        Chai.expect(result[0].message).eq("[model] is not valid")
    })

    it("Should validate when inside model", () => {
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
                tslib_1.__param(0, src_1.val.objectid()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ObjectIdValidator();
        let clazz = <Kecubung.ClassMetaData>meta[0]
        let result = test.validate({
            parentField: "entity",
            value: "123-5",
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model"
        })
        Chai.expect(result[0].field).eq("entity.model")
        Chai.expect(result[0].message).eq("[model] is not valid")
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
                tslib_1.__param(0, src_1.val.objectid("Invalid")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ObjectIdValidator();
        let clazz = <Kecubung.ClassMetaData>meta[0]
        let result = test.validate({
            value: "123-5",
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model"
        })
        Chai.expect(result[0].field).eq("model")
        Chai.expect(result[0].message).eq("Invalid")
    })
})