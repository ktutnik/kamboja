import {ApiController, Controller, internal, http } from "../src/core"

export module MyModule{
    export class MyController extends Controller{
        @internal()
        internalMethod(){}

        myMethod(par1){}

        @http.get("/override/:id")
        methodWithGetOverride(id){}
    }

    export class MyApiController extends ApiController{
        getPage(offset, pageWidth){}
        get(id){}
        add(body){}
        modify(id, body){}
        delete(id){}
    }
}