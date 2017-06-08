import { Controller } from "../../../src/controller"
import { Middleware } from "../../../src"
import { val, ApiActionResult } from "../../../src"

let middleware = new Middleware.MiddlewareDecorator()

export class UnQualifiedNameOnMethodController extends Controller {

    @middleware.use("UnqualifiedName, path/of/nowhere")
    returnView() {
        return new ApiActionResult("Helow")
    }
}