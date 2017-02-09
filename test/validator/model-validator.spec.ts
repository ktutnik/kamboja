import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { ModelValidator } from "../../src/validator/model-validator"
import { MetaDataStorage } from "../../src/metadata-storage"
import { DefaultIdentifierResolver } from "../../src/resolver"
import { Validator } from "../../src/validator/validator"


let modelMeta = H.fromCode(`
    var MyModel = (function () {
        function MyModel() {
        }
        return MyModel;
    }());
    tslib_1.__decorate([
        src_1.val.required(),
        src_1.val.otherDecorator(),
        tslib_1.__metadata("design:type", String)
    ], MyModel.prototype, "myProp", void 0);
    exports.MyModel = MyModel;
`, "model/my-model")
let storage = new MetaDataStorage(new DefaultIdentifierResolver())
storage.save(modelMeta);
Validator.initValidators(new DefaultIdentifierResolver())

describe.only("ModelValidator", () => {
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
                tslib_1.__param(0, src_1.val.model("MyModel, model/my-model")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ModelValidator(new DefaultIdentifierResolver());
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({ myProp: null }, clazz.methods[0].parameters[0])
        Chai.expect(result[0].field == "model.myProp")
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
                tslib_1.__param(0, src_1.val.model("MyModel, model/my-model")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ModelValidator(new DefaultIdentifierResolver());
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({ myProp: 200 }, clazz.methods[0].parameters[0])
        Chai.expect(result).undefined
    })

    it("Should not error when the model is null", () => {
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
                tslib_1.__param(0, src_1.val.model("MyModel, model/my-model")),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new ModelValidator(new DefaultIdentifierResolver());
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate(null, clazz.methods[0].parameters[0])
        Chai.expect(result).undefined
    })
})