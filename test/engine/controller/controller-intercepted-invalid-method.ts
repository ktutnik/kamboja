import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src"
import { val, JsonActionResult } from "../../../src"

export class UnQualifiedNameOnMethodController extends Controller {

    @interceptor.add("UnqualifiedName, path/of/nowhere")
    returnView() {
        return this.json("Helow")
    }
}