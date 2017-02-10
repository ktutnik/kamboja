import * as Chai from "chai"
import { ValidatorDecorator } from "../../src/validator/baseclasses"

describe("Core", () => {
    it("Instantiate Validator Decorator properly", () => {
        let decorator = new ValidatorDecorator();
        decorator.email()
        decorator.range(1)
        decorator.required()
        decorator.type("")
    })

})