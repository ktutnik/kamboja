import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src"
import { val, JsonActionResult } from "../../../src"

@interceptor.add("UnqualifiedName, path/of/nowhere")
export class UnQualifiedNameOnClassController extends Controller {

    returnView() {
        return this.json("Helow")
    }
}