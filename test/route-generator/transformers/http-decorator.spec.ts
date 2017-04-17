import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { HttpDecoratorTransformer } from "../../../src/route-generator/transformers/http-decorator"

describe("DefaultActionTransformer", () => {
    it("Should pass to next transformer if provide @http.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.get(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info[0].httpMethod).eq("GET")
    })

    it("Should pass to next transformer if provide @http.post()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.post(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info[0].httpMethod).eq("POST")
    })

    it("Should pass to next transformer if provide @http.put()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.put(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info[0].httpMethod).eq("PUT")
    })

    it("Should pass to next transformer if provide @http.patch()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.patch(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info[0].httpMethod).eq("PATCH")
    })

    it("Should pass to next transformer if provide @http.delete()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.delete(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info[0].httpMethod).eq("DELETE")
    })

    it("Should able to change route with relative @http.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.get("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("GET")
        Chai.expect(result.info[0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @http.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.get("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("GET")
        Chai.expect(result.info[0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @http.post()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.post("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("POST")
        Chai.expect(result.info[0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @http.post()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.post("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("POST")
        Chai.expect(result.info[0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @http.patch()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.patch("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("PATCH")
        Chai.expect(result.info[0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @http.patch()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.patch("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("PATCH")
        Chai.expect(result.info[0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @http.put()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.put("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("PUT")
        Chai.expect(result.info[0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @http.put()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.put("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("PUT")
        Chai.expect(result.info[0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @http.delete()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.delete("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("DELETE")
        Chai.expect(result.info[0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @http.delete()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.delete("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].httpMethod).eq("DELETE")
        Chai.expect(result.info[0].route).eq("/absolute/relative")
    })

    it("Should pass to next transformer if not contains decorator", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
    })

    it("Should pass to next transformer contains previousResult", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <Core.RouteInfo[]>[{}])
        Chai.expect(result.status).eq("Next")
    })
})