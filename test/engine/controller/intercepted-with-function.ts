import { Controller } from "../../../src/controller"
import { middleware } from "../../../src"
import { val, JsonActionResult, Core } from "../../../src"
import { id } from "../interceptor/interceptor-identifier"


export class DummyApi extends Controller {

    @middleware.add(async (i) => { return new JsonActionResult("Hello", undefined, undefined) })
    index() {
        return this.json("Helow")
    }

    nonIntercepted(){
        return this.json("Helow")
    }
}