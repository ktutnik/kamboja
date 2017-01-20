import { RouteGenerator } from "../src/router/route-generator"
import { RouteInfo } from "../src/core"
import * as Babylon from "babylon"
import * as Kenanga from "kenanga"
import * as Chai from "chai"

describe("Route Generator", () => {
    describe("General function", () => {
        it("Should generate route with nested module", () => {
            let ast = Babylon.parse(`
                var ParentModule;
                (function (ParentModule) {
                    var ChildModule;
                    (function (ChildModule) {
                        var MyClass = (function () {
                            function MyClass() {
                            }
                            MyClass.prototype.myMethod = function (par1, par2) { };
                            MyClass.prototype.myMethodWoParams = function () { };
                            return MyClass;
                        }());
                        ChildModule.MyClass = MyClass;
                    })(ChildModule = ParentModule.ChildModule || (ParentModule.ChildModule = {}));
                })(ParentModule = exports.ParentModule || (exports.ParentModule = {}));
            `)
            let meta = Kenanga.transform(ast, "./controller/example");
            let dummy = new RouteGenerator(meta);
            let result = dummy.getRoutes();
            Chai.expect(result.length).eq(2);
            Chai.expect(result).to.deep.eq([<RouteInfo>{
                analysis: [],
                httpMethod: "GET",
                methodName: "myMethod",
                generatingMethod: "Default",
                route: "/parentmodule/childmodule/myclass/mymethod/:par1/:par2",
                className: "ParentModule.ChildModule.MyClass, ./controller/example",
                parameters: ["par1", "par2"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "GET",
                generatingMethod: "Default",
                methodName: "myMethodWoParams",
                route: "/parentmodule/childmodule/myclass/mymethodwoparams",
                className: "ParentModule.ChildModule.MyClass, ./controller/example",
                parameters: []
            }])
        })

        it("Should not generate non exported class", () => {
            let ast = Babylon.parse(`
                var ParentModule;
                (function (ParentModule) {
                    var ChildModule;
                    (function (ChildModule) {
                        var NonExportedClass = (function () {
                            function NonExportedClass() {
                            }
                            NonExportedClass.prototype.myMethod = function (par1, par2) { };
                            return NonExportedClass;
                        }());
                    })(ChildModule = ParentModule.ChildModule || (ParentModule.ChildModule = {}));
                })(ParentModule = exports.ParentModule || (exports.ParentModule = {}));        `)
            let meta = Kenanga.transform(ast, "");
            let dummy = new RouteGenerator(meta);
            let result = dummy.getRoutes();
            Chai.expect(result.length).eq(0);
        })
    })

    describe("Decorator", () => {
        it("Should not include @internal method", () => {
            let ast = Babylon.parse(`
            var ProductController = (function () {
                function ProductController() {
                }
                ProductController.prototype.privateMethod = function () { };
                return ProductController;
            }());
            __decorate([
                core_1.internal(),
            ], ProductController.prototype, "privateMethod", null);
            exports.ProductController = ProductController;
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta);
            let result = dummy.getRoutes();
            Chai.expect(result.length).eq(0);
        })

        it("Should override route when http method decorator provided", () => {
            let ast = Babylon.parse(`
                var core_1 = require("../../../src/core");
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.getProductById = function (id) { };
                    ProductController.prototype.saveProduct = function (model) { };
                    ProductController.prototype.deleteProduct = function (id) { };
                    ProductController.prototype.updateProduct = function (id, model) { };
                    return ProductController;
                }());
                __decorate([
                    core_1.http.get("/product/:id"),
                ], ProductController.prototype, "getProductById", null);
                __decorate([
                    core_1.http.post("/product/"),
                ], ProductController.prototype, "saveProduct", null);
                __decorate([
                    core_1.http.delete("/product/:id"),
                ], ProductController.prototype, "deleteProduct", null);
                __decorate([
                    core_1.http.put("/product/:id"),
                ], ProductController.prototype, "updateProduct", null);
                exports.ProductController = ProductController;
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta);
            let result = dummy.getRoutes();
            Chai.expect(result).to.deep.eq([<RouteInfo>{
                analysis: [],
                httpMethod: "GET",
                generatingMethod: "HttpMethodDecorator",
                methodName: "getProductById",
                route: "/product/:id",
                className: "ProductController, ./controller/product-controller",
                parameters: ["id"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "POST",
                generatingMethod: "HttpMethodDecorator",
                methodName: "saveProduct",
                route: "/product/",
                className: "ProductController, ./controller/product-controller",
                parameters: ["model"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "DELETE",
                generatingMethod: "HttpMethodDecorator",
                methodName: "deleteProduct",
                route: "/product/:id",
                className: "ProductController, ./controller/product-controller",
                parameters: ["id"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "PUT",
                generatingMethod: "HttpMethodDecorator",
                methodName: "updateProduct",
                route: "/product/:id",
                className: "ProductController, ./controller/product-controller",
                parameters: ["id", "model"]
            }])
        })

        it("Should identify non associated parameters in route", () => {
            let ast = Babylon.parse(`
                var core_1 = require("../../../src/core");
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.getProductById = function (id) { };
                    return ProductController;
                }());
                __decorate([
                    core_1.http.get("/product/:notId"),
                ], ProductController.prototype, "getProductById", null);
                exports.ProductController = ProductController;            
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta);
            let result = dummy.getRoutes();
            Chai.expect(result[0].analysis[0].type).eq("Error")
            Chai.expect(result[0].analysis[0].message).contain("doesn't have associated parameter")
            //fall back to default route
            Chai.expect(result[0].route).eq("/product/getproductbyid/:id")
        })

        it("Should identify if method doesn't have parameters but route contain parameter", () => {
            let ast = Babylon.parse(`
                var core_1 = require("../../../src/core");
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.getProductById = function () { };
                    return ProductController;
                }());
                __decorate([
                    core_1.http.get("/product/:notId"),
                ], ProductController.prototype, "getProductById", null);
                exports.ProductController = ProductController;         
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta, { apiConvention: true });
            let result = dummy.getRoutes();
            Chai.expect(result[0].analysis[0].type).eq("Error")
            Chai.expect(result[0].analysis[0].message).contain("route contains parameters but getProductById method doesn't")
            //fall back to default route
            Chai.expect(result[0].route).eq("/product/getproductbyid")
        })

        it("Should identify if in GET, if route doesn't have parameters but method contain parameter", () => {
            let ast = Babylon.parse(`
                var core_1 = require("../../../src/core");
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.getProductById = function (id) { };
                    return ProductController;
                }());
                __decorate([
                    core_1.http.get("/product/get/product"),
                ], ProductController.prototype, "getProductById", null);
                exports.ProductController = ProductController;         
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta, { apiConvention: true });
            let result = dummy.getRoutes();
            Chai.expect(result[0].analysis[0].type).eq("Error")
            Chai.expect(result[0].analysis[0].message).contain("method getProductById contains parameters but route doesn't")
            //fall back to default route
            Chai.expect(result[0].route).eq("/product/getproductbyid/:id")
        })

        it("Should identify multiple decorators", () => {
            let ast = Babylon.parse(`
                var core_1 = require("../../../src/core");
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.getProductById = function (id) { };
                    return ProductController;
                }());
                __decorate([
                    core_1.http.internal(),
                    core_1.http.get("/product/:notId"),
                ], ProductController.prototype, "getProductById", null);
                exports.ProductController = ProductController;            
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta);
            let result = dummy.getRoutes();
            Chai.expect(result[0].analysis[0].type).eq("Error")
            Chai.expect(result[0].analysis[0].message).contain("multiple decorators")
            //fall back to default route
            Chai.expect(result[0].route).eq("/product/getproductbyid/:id")
        })
    })

    describe("API convention", () => {
        it("Should return route properly", () => {
            let ast = Babylon.parse(`
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.getByPage = function (offset, pageWidth) {
                        if (pageWidth === void 0) { pageWidth = 50; }
                    };
                    ProductController.prototype.get = function (id) { };
                    ProductController.prototype.add = function (model) { };
                    ProductController.prototype.modify = function (id, model) { };
                    ProductController.prototype.delete = function (id) { };
                    return ProductController;
                }());
                exports.ProductController = ProductController;
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta, { apiConvention: true });
            let result = dummy.getRoutes();
            Chai.expect(result).to.deep.eq([<RouteInfo>{
                analysis: [],
                httpMethod: "GET",
                generatingMethod: "ApiConvention",
                methodName: "getByPage",
                route: "/product/page/:offset/:pageWidth",
                className: "ProductController, ./controller/product-controller",
                parameters: ["offset", "pageWidth"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "GET",
                generatingMethod: "ApiConvention",
                methodName: "get",
                route: "/product/:id",
                className: "ProductController, ./controller/product-controller",
                parameters: ["id"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "POST",
                generatingMethod: "ApiConvention",
                methodName: "add",
                route: "/product",
                className: "ProductController, ./controller/product-controller",
                parameters: ["model"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "PUT",
                generatingMethod: "ApiConvention",
                methodName: "modify",
                route: "/product/:id",
                className: "ProductController, ./controller/product-controller",
                parameters: ["id", "model"]
            }, <RouteInfo>{
                analysis: [],
                httpMethod: "DELETE",
                generatingMethod: "ApiConvention",
                methodName: "delete",
                route: "/product/:id",
                className: "ProductController, ./controller/product-controller",
                parameters: ["id"]
            }])
        })

        it("Should identify missing parameter", () => {
            let ast = Babylon.parse(`
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.get = function () { };
                    return ProductController;
                }());
                exports.ProductController = ProductController;       
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta, { apiConvention: true });
            let result = dummy.getRoutes();
            Chai.expect(result[0].analysis[0].type).eq("Warning")
            Chai.expect(result[0].analysis[0].message).contain("no parameters found")
            //fall back to default route
            Chai.expect(result[0].route).eq("/product/get")
        })

        it("Should fall back to default route when method name doesn't match the naming convention", () => {
            let ast = Babylon.parse(`
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.dummy = function () { };
                    return ProductController;
                }());
                exports.ProductController = ProductController;       
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta, { apiConvention: true });
            let result = dummy.getRoutes();
            //fall back to default route
            Chai.expect(result).to.deep.eq([<RouteInfo>{
                route: "/product/dummy",
                httpMethod: "GET",
                generatingMethod: "Default",
                methodName: "dummy",
                analysis: [],
                className: "ProductController, ./controller/product-controller",
                parameters: []
            }])
        })
    })

    describe("Priority", () => {
        it("Should prioritized decorated method vs api convention", () => {
            let ast = Babylon.parse(`
                var ProductController = (function () {
                    function ProductController() {
                    }
                    ProductController.prototype.get = function (id) { };
                    return ProductController;
                }());
                __decorate([
                    core_1.http.get("/product/get/by/:id"),
                ], ProductController.prototype, "get", null);
                exports.ProductController = ProductController;    
            `)
            let meta = Kenanga.transform(ast, "./controller/product-controller.js");
            let dummy = new RouteGenerator(meta, { apiConvention: true });
            let result = dummy.getRoutes();
            //fall back to default route
            Chai.expect(result).to.deep.eq([<RouteInfo>{
                route: "/product/get/by/:id",
                httpMethod: "GET",
                generatingMethod: "HttpMethodDecorator",
                methodName: "get",
                analysis: [],
                className: "ProductController, ./controller/product-controller",
                parameters: ["id"]
            }])
        })
    })
})

