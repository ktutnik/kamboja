import { Controller, ApiController } from "../../../src/controller"
import { val, HttpStatusError, Core } from "../../../src"

export function customValidation() {
    return (...args) => { }
}

export class DummyApi extends Controller {

    returnActionResult() {
        return new Core.ActionResult("/go/go/kamboja.js");
    }

    returnPromisedActionResult() {
        return Promise.resolve(new Core.ActionResult("/go/go/kamboja.js"));
    }

    returnPromisedValue(){
        return Promise.resolve("This is dumb")
    }

    returnNonActionResult() {
        return "This is dumb"
    }

    returnVoid(){}

    setTheCookie() {
        let result = new Core.ActionResult("/go/go/kamboja.js");
        result.cookies = [{ key: "TheKey", value: "TheValue", options: { expires: true } }]
        return result;
    }

    validationTest( @val.required() age) {
        if (this.validator.isValid()) {
            return true
        }
        return this.validator.getValidationErrors()
    }

    customValidationTest( @customValidation() par1) {
        if (this.validator.isValid()) {
            return true
        }
        return this.validator.getValidationErrors()
    }

    throwError() {
        throw new Error("Internal error")
    }

    throwStatusError() {
        throw new HttpStatusError(404, "Not found action")
    }

}