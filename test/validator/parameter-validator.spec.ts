import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { RequiredValidator } from "../../src/validator/required-validator"
import { ParameterValidator } from "../../src/validator/parameter-validator"
import { MetaDataStorage } from "../../src/metadata-storage"
import { DefaultIdentifierResolver } from "../../src/resolver"

describe("ParameterValidator", () => {
    let storage: MetaDataStorage;
    let validators = [
        new RequiredValidator()
    ]

    beforeEach(() => {
        storage = new MetaDataStorage(new DefaultIdentifierResolver())
        let modelMeta = H.fromCode(`
            var MyModel = (function () {
                function MyModel() {
                }
                return MyModel;
            }());
            tslib_1.__decorate([
                src_1.val.required(),
            ], MyModel.prototype, "myProp", void 0);
            exports.MyModel = MyModel;
        `, "model/my-model")
        storage.save(modelMeta)
        let parentModel = H.fromCode(`
            var ParentModel = (function () {
                function ParentModel() {
                }
                return ParentModel;
            }());
            tslib_1.__decorate([
                src_1.val.type("MyModel, model/my-model"),
            ], ParentModel.prototype, "child", void 0);
            exports.ParentModel = ParentModel;
        `, "model/parent-model")
        storage.save(parentModel)
    })

    it("Should return error message on model parameter", () => {
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
                tslib_1.__param(0, src_1.val.type("MyModel, model/my-model")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ParameterValidator(storage, validators);
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({ myProp: null }, clazz.methods[0].parameters[0])
        Chai.expect(result[0].field).eq("model.myProp")
        Chai.expect(result[0].message).contain("required")
    })

    it("Should return error message on nested model parameter", () => {
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
                tslib_1.__param(0, src_1.val.type("ParentModel, model/parent-model")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ParameterValidator(storage, validators);
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({ child: { myProp: null } }, clazz.methods[0].parameters[0])
        Chai.expect(result[0].field).eq("model.child.myProp")
        Chai.expect(result[0].message).contain("required")
    })

    it("Should return undefined on nested model parameter", () => {
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
                tslib_1.__param(0, src_1.val.type("ParentModel, model/parent-model")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ParameterValidator(storage, validators);
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({ child: { myProp: 200 } }, clazz.methods[0].parameters[0])
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
                tslib_1.__param(0, src_1.val.type("ParentModel, model/parent-model")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ParameterValidator(storage, validators);
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate(null, clazz.methods[0].parameters[0])
        Chai.expect(result).undefined
    })

    it("Should not error if provided unknown decorator", () => {
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
                tslib_1.__param(0, src_1.val.unknownDecorator()),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ParameterValidator(storage, validators);
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate(null, clazz.methods[0].parameters[0])
        Chai.expect(result).undefined
    })
})