import { http, ApiController } from "../../../src/core"

export class DecoratorController extends ApiController {
    @http.get("/this/is/get")
    get() {
        return { data: "Hello" };
    }

    @http.post("/this/is/post")
    post(){
        return { data: "Hello" };
    }

    @http.put("/this/is/put")
    put(){
        return { data: "Hello" };
    }

    @http.delete("/this/is/delete")
    delete(){
        return { data: "Hello" };
    }
}