import { Controller } from "../../../src/controller"
import { middleware } from "../../../src"
import { val, JsonActionResult } from "../../../src"

export class UnQualifiedNameOnMethodController extends Controller {

    @middleware.add("UnqualifiedName, path/of/nowhere")
    returnView() {
        return this.json("Helow")
    }
}