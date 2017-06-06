import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { RequiredValidator } from "../../src/validator/required-validator"
import { EmailValidator } from "../../src/validator/email-validator"
import { RangeValidator } from "../../src/validator/range-validator"
import { TypeValidator } from "../../src/validator/type-validator"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { DefaultIdentifierResolver, DefaultPathResolver } from "../../src/resolver"
import { UserModel } from "./model/user-model"
import { ItemModel } from "./model/item-model"
import { CategoryModel } from "./model/category-model"
import { ValidatorCommand } from "../../src/core"


describe("TypeValidator", () => {
    let storage: MetaDataLoader;
    let validators: ValidatorCommand[]
    let test: TypeValidator;

    beforeEach(() => {
        storage = new MetaDataLoader(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        storage.load("model", "Model")
        storage.load("controller", "Controller")
        validators = [
            new RequiredValidator(),
            new RangeValidator(),
            new EmailValidator()
        ]
        test = new TypeValidator(storage);
        validators.push(test)
        test.validators = validators
    })

    it("Should return undefined on valid value", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "email@host.com",
            displayName: "Nobita Nobi",
            item: null
        }
        let result = test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "user"
        })
        Chai.expect(result).undefined
    })

    it("Should return error message on model parameter", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "not-an-email",
            displayName: "Nobita Nobi",
            item: null
        }
        let result = test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "user"
        })
        Chai.expect(result[0].field).eq("user.email")
        Chai.expect(result[0].message).contain("not a valid email address")
    })

    it("Should validate nested model", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "not-an-email",
            displayName: "Nobita Nobi",
            item: {
                barCode: null,
                name: "Item Name"
            }
        }
        let result = test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "user"
        })
        Chai.expect(result[1].field).eq("user.item.barCode")
        Chai.expect(result[1].message).contain("required")
    })

    it("Should validate nested model with array type of children", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: CategoryModel = {
            name: "The category",
            items: [{
                barCode: null,
                name: "Item Name"
            }, {
                barCode: "fdasfa",
                name: null
            }]
        }
        let method = clazz.methods.filter(x => x.name == "nestedWithArray")[0]
        let parameter = method.parameters[0]
        let result = test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: parameter.decorators[0].parameters,
            field: parameter.name
        })
        Chai.expect(result).deep.eq([{
            field: 'category.items[1].name',
            message: '[name] is required'
        },
        {
            field: 'category.items[0].barCode',
            message: '[barCode] is required'
        }])
    })

    it("Should validate nested model with array type of children but provided non array", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model = {
            name: "The category",
            items: {
                barCode: null,
                name: "Item Name"
            }
        }
        let method = clazz.methods.filter(x => x.name == "nestedWithArray")[0]
        let parameter = method.parameters[0]
        let result = test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: parameter.decorators[0].parameters,
            field: parameter.name
        })
        Chai.expect(result).deep.eq([{
            field: 'category.items',
            message: '[category.items] must be a type of Array'
        }])
    })

    it("Should validate all decorators in field", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let result = test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "user"
        })
        Chai.expect(result[0].field).eq("user.email")
        Chai.expect(result[0].message).contain("is required")
    })

    it("Should not validate field without @val decorator", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let method = clazz.methods.filter(x => x.name == "noValidator")[0]
        let result = test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: undefined,
            field: "user"
        })
        Chai.expect(result).undefined
    })

    it("Should not error if provided @val.type('string')", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let method = clazz.methods.filter(x => x.name == "primitiveType")[0]
        let parameter = method.parameters[0]
        let result = test.validate({
            value: "halo",
            classInfo: clazz,
            decoratorArgs: parameter.decorators[0].parameters,
            field: parameter.name
        })
        Chai.expect(result).undefined
    })

    it("Should not error if provided @val.type('number')", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let method = clazz.methods.filter(x => x.name == "primitiveType")[0]
        let parameter = method.parameters[1]
        let result = test.validate({
            value: "halo",
            classInfo: clazz,
            decoratorArgs: parameter.decorators[0].parameters,
            field: parameter.name
        })
        Chai.expect(result).undefined
    })

    it("Should not error if provided @val.type('boolean')", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let method = clazz.methods.filter(x => x.name == "primitiveType")[0]
        let parameter = method.parameters[2]
        let result = test.validate({
            value: "halo",
            classInfo: clazz,
            decoratorArgs: parameter.decorators[0].parameters,
            field: parameter.name
        })
        Chai.expect(result).undefined
    })

    it("Should give correct error information if model name not found in controller parameter", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let method = clazz.methods.filter(x => x.name == "missTypedModel")[0]
        Chai.expect(() => test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: method.parameters[0].decorators[0].parameters,
            field: "user"
        })).throw("Class [UserModel, not/valid/path] in @val.type is no found in [UserController]")
    })

    it("Should give correct error information if model name not found on nested model", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: {
                barCode: null,
                name: "Item Name"
            }
        }
        let method = clazz.methods.filter(x => x.name == "nestedError")[0]
        Chai.expect(() => test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: method.parameters[0].decorators[0].parameters,
            field: "user"
        })).throw("Class [ItemModel, not/valid/item/path] in @val.type is no found in [UserModel]")
    })

    it("Should give correct error information if class name is not specified", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let method = clazz.methods.filter(x => x.name == "notSpecifiedClassName")[0]
        Chai.expect(() => test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: method.parameters[0].decorators[0].parameters,
            field: "user"
        })).throw("Qualified class name should be specified in @val.type in [UserController]")
    })

    it("Should give correct error information in invalid class name provided", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: null,
            displayName: "Nobita Nobi",
            item: null
        }
        let method = clazz.methods.filter(x => x.name == "invalidClassName")[0]
        Chai.expect(() => test.validate({
            value: model,
            classInfo: clazz,
            decoratorArgs: method.parameters[0].decorators[0].parameters,
            field: "user"
        })).throw("Invalid qualified class name [NonValidClassName] in @val.type decorator in [UserController]")
    })
})