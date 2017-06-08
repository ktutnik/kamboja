import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { ValidatorImpl } from "../../src/validator/validator"
import { DefaultIdentifierResolver, DefaultPathResolver } from "../../src/resolver"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { RequiredValidator } from "../../src/validator/required-validator"
import { EmailValidator } from "../../src/validator/email-validator"
import { RangeValidator } from "../../src/validator/range-validator"
import { TypeValidator } from "../../src/validator/type-validator"
import { ValidatorCommand, FieldValidatorArg } from "kamboja-core"
import { UserModel } from "./model/user-model"
import { ItemModel } from "./model/item-model"
import {ValidatorBase} from "../../src/validator/baseclasses"


export class ExternalValidator extends ValidatorBase{
    validate(args:FieldValidatorArg){
        return undefined;
    }
}

describe("Validator", () => {
    let storage: MetaDataLoader;
    let validators: ValidatorCommand[]
    let test: ValidatorImpl;

    beforeEach(() => {
        storage = new MetaDataLoader(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        storage.load("model", "Model")
        storage.load("controller", "Controller")
        test = new ValidatorImpl(storage, validators)
    })

    it("Should return undefined when provided correct value", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "email@host.com",
            displayName: "Nobita Nobi",
            item: null
        }
        test.setValue([model], clazz, "saveUser")
        let isValid = test.isValid();
        let result = test.getValidationErrors();
        Chai.expect(result).undefined
        Chai.expect(isValid).true
    })

    it("Should return messages when provided incorrect value", () => {
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "not-an-email",
            displayName: "Nobita Nobi",
            item: null
        }
        test.setValue([model], clazz, "saveUser")
        let isValid = test.isValid();
        let result = test.getValidationErrors();
        Chai.expect(result).deep.eq([{
            field: 'user.email',
            message: '[email] is not a valid email address'
        }])
        Chai.expect(isValid).false
    })

    it("Should not validate parameter without validation decorator", () => {
        let test = new ValidatorImpl(storage, [new ExternalValidator()])
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "not-valid-email",
            displayName: "Nobita Nobi",
            item: null
        }
        test.setValue([model], clazz, "noValidator")
        let isValid = test.isValid();
        Chai.expect(isValid).true
    })

    it("Should not error if provided other decorator", () => {
        let test = new ValidatorImpl(storage, [new ExternalValidator()])
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "not-valid-email",
            displayName: "Nobita Nobi",
            item: null
        }
        test.setValue([model], clazz, "customDecorator")
        let isValid = test.isValid();
        Chai.expect(isValid).true
    })

    it("Should able to use external validator", () => {
        let test = new ValidatorImpl(storage, [new ExternalValidator()])
        let clazz = storage.get("UserController, controller/user-controller")
        let model: UserModel = {
            email: "nobita@yahoo.com",
            displayName: "Nobita Nobi",
            item: null
        }
        test.setValue([model], clazz, "saveUser")
        let isValid = test.isValid();
        Chai.expect(isValid).true
    })
})