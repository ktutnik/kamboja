import { http, ApiController } from "../../../src/core"

export class DecoratorController extends ApiController {
    
    @http.get("/multiple")
    @http.get("/multiple/home")
    get() {
        return { data: "Hello" };
    }
}