import { Controller } from "../../../src/controller"
import { Middleware } from "../../../src"
import { val, ApiActionResult } from "../../../src"

let middleware = new Middleware.MiddlewareDecorator()

@middleware.use("UnqualifiedName, path/of/nowhere")
export class UnQualifiedNameOnClassController extends Controller {

    returnView() {
        return new ApiActionResult("Helow")
    }
}