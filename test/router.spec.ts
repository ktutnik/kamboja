import { Router } from "../src/router"
import { DefaultResolver } from "../src/resolver"
import * as Chai from "chai"
import { RouteInfo } from "../src/core"

describe("Router", () => {
    it("Should return route info properly", () => {
        let test = new Router("./test/dummy/router", new DefaultResolver())
        let routes = test.getRoutes();
        Chai.expect(routes).deep.eq([
            {
                route: "/default/getdefaultproduct/:id",
                httpMethod: "GET",
                className: "DefaultController, test/dummy/router/default-controller",
                methodName: "getDefaultProduct",
                generatingMethod: "Default",
                parameters: [
                    "id"
                ],
                analysis: [],
                classId: "DefaultController, test/dummy/router/default-controller"
            },
            {
                route: "/default/saveproduct/:data",
                httpMethod: "GET",
                className: "DefaultController, test/dummy/router/default-controller",
                methodName: "saveProduct",
                generatingMethod: "Default",
                parameters: [
                    "data"
                ],
                analysis: [],
                classId: "DefaultController, test/dummy/router/default-controller"
            },
            {
                route: "/product/get/by/:id",
                httpMethod: "GET",
                className: "ProductController, test/dummy/router/product-controller",
                methodName: "get",
                generatingMethod: "HttpMethodDecorator",
                parameters: [
                    "id"
                ],
                analysis: [],
                classId: "ProductController, test/dummy/router/product-controller"
            }
        ])
    })

    it("Should throw when directory not found", () => {
        let test = new Router("./test/router", new DefaultResolver())
        Chai.expect(() => test.getRoutes()).throw(/not found/);
    })
})