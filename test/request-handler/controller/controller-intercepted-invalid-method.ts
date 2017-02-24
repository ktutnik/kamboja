import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src/request-handler/interceptor-decorator"
import { val, decoratorName, Interceptor, Invocation, JsonActionResult } from "../../../src"

export class UnQualifiedNameOnMethodController extends Controller {

    @interceptor("UnqualifiedName, path/of/nowhere")
    returnView() {
        return this.json("Helow")
    }
}