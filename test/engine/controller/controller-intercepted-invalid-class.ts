import { Controller } from "../../../src/controller"
import { middleware } from "../../../src"
import { val, JsonActionResult } from "../../../src"

@middleware.use("UnqualifiedName, path/of/nowhere")
export class UnQualifiedNameOnClassController extends Controller {

    returnView() {
        return this.json("Helow")
    }
}