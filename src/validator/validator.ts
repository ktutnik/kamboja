import * as Kecubung from "kecubung"
import * as Core from "../core"
import { ValidatorBase, getDecoratorName, ParametersValidatorArg } from "./baseclasses"
import { TypeValidator } from "./type-validator"
import { RequiredValidator } from "./required-validator"
import { EmailValidator } from "./email-validator"
import { RangeValidator } from "./range-validator"

export class ValidatorImpl extends ValidatorBase implements Core.Validator {
    private parameters: any[]
    private classMetaData: Kecubung.ClassMetaData
    private errors: Core.ValidationError[] = []
    private methodName: string

    static create(facade:Core.Facade, routeInfo:Core.RouteInfo, values:any[]): Core.Validator{
        let commands: Core.ValidatorCommand[] = [];
        if (facade.validators) {
            facade.validators.forEach(x => {
                if (typeof x == "string") {
                    try {
                        let validator = facade.dependencyResolver.resolve(x)
                        commands.push(validator)
                    }
                    catch (e) {
                        throw new Error(`Can not instantiate custom validator [${x}]`)
                    }
                }
                else commands.push(x)
            })
        }
        let validator = new ValidatorImpl(facade.metaDataStorage, commands)
        validator.setValue(values, routeInfo.classMetaData, routeInfo.methodMetaData.name)
        return validator
    }

    constructor(private metaDataStorage: Core.MetaDataStorage,
        validators: Core.ValidatorCommand[]) {
        super()
        if (!validators) validators = []
        this.validators = validators;
        let typeValidator = new TypeValidator(metaDataStorage);
        typeValidator.validators = this.validators;
        this.validators.push(typeValidator)
        this.validators.push(new EmailValidator())
        this.validators.push(new RangeValidator())
        this.validators.push(new RequiredValidator())
    }

    setValue(parameters: any[],
        meta: Kecubung.ClassMetaData, methodName: string) {
        this.parameters = parameters
        this.classMetaData = meta
        this.methodName = methodName
    }

    isValid() {
        let result = this.validateFields(<ParametersValidatorArg>{
            type: "ParametersValidator",
            classInfo: this.classMetaData,
            methodName: this.methodName,
            parameterValues: this.parameters,
        })
        if(result)
            this.errors = this.errors.concat(result)
        return this.errors.length == 0
    }

    getValidationErrors() {
        return this.errors.length > 0 ? this.errors : undefined;
    }
}