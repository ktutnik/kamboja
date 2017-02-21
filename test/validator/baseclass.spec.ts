import * as Chai from "chai"
import { ValidatorDecorator, ValidatorBase } from "../../src/validator/baseclasses"

describe("Validator Base Classes", () => {
    it("Instantiate Validator Decorator properly", () => {
        let decorator = new ValidatorDecorator();
        decorator.email()
        decorator.range(1)
        decorator.required()
        decorator.type("")
    })

    describe("ValidatorBase", () => {
        it("Should instantiate validator base properly", () => {
            let validator = new ValidatorBase();
            validator.validate(null)
        })

        it("Should identify empty object properly", () => {
            let validator = new ValidatorBase();
            Chai.expect(validator.isEmpty(null)).true
            Chai.expect(validator.isEmpty(undefined)).true
            Chai.expect(validator.isEmpty("")).true
            Chai.expect(validator.isEmpty("     ")).true
        })
    })


})