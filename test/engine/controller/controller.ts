import { Controller, ApiController } from "../../../src/controller"
import { val, HttpStatusError } from "../../../src"

export function customValidation(){
    return (...args) => {}
}

export class DummyApi extends Controller {
    returnView() {
        return this.view({}, "index");
    }
    returnFile() {
        return this.file("/go/go/kamboja.js");
    }
    returnRedirect() {
        return this.redirect("/go/go/kamboja.js");
    }

    //throw error
    returnNonActionResult() {
        return "This is dumb"
    }

    setTheCookie() {
        this.setCookie("TheKey", "TheValue", { expires: true })
        return this.view()
    }

    validationTest(@val.required() age){
        if(this.validator.isValid()){
            return this.json(true)
        }
        return this.json(this.validator.getValidationErrors())
    }

    customValidationTest(@customValidation() par1){
        if(this.validator.isValid()){
             return this.json(true)
        }
        return this.json(this.validator.getValidationErrors())
    }

    throwError(){
        throw new Error("Internal error")
    }

    throwStatusError(){
        throw new HttpStatusError(404, "Not found action")
    }

}