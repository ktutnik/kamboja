import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src/engine/interceptor-decorator"
import { val, JsonActionResult } from "../../../src"

@interceptor("UnqualifiedName, path/of/nowhere")
export class UnQualifiedNameOnClassController extends Controller {

    returnView() {
        return this.json("Helow")
    }
}