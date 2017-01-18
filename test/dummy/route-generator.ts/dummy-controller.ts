import { http, internal } from "../../../src/core"

export class ProductController {
    @http.get("/product/:notId")
    getProductById(id){}
}