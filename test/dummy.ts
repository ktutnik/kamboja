import {http} from "../src/core"

export class ProductController{
    @http.get("/product/get/by/id")
    get(id){}
}