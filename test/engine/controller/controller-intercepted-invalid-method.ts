import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src/engine/interceptor-decorator"
import { val, JsonActionResult } from "../../../src"

export class UnQualifiedNameOnMethodController extends Controller {

    @interceptor("UnqualifiedName, path/of/nowhere")
    returnView() {
        return this.json("Helow")
    }
}