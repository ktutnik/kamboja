import { Controller, ApiController } from "../../../src/controller"
import { val, HttpStatusError, ApiActionResult } from "../../../src"

export class DummyApi extends ApiController {
    returnTheParam(par1) {
        return par1;
    }

    returnTheParamWithPromise(par1) {
        return Promise.resolve(par1);
    }

    voidMethod() { }

    internalError() {
        throw new Error("Internal error from DummyApi")
    }

    returnOk() {
        return new ApiActionResult("OK!")
    }

    validationTest( @val.required() required) { 
        return "OK"
    }

    statusError(){
        throw new HttpStatusError(404, "Not found")
    }
}