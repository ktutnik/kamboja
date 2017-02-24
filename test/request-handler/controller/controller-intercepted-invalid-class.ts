import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src/request-handler/interceptor-decorator"
import { val, decoratorName, Interceptor, Invocation, JsonActionResult } from "../../../src"

@interceptor("UnqualifiedName, path/of/nowhere")
export class UnQualifiedNameOnClassController extends Controller {

    returnView() {
        return this.json("Helow")
    }
}