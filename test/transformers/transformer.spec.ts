import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as Core from "../../src/core"
import * as H from "../helper"
import * as Transformer from "../../src/transformers"

describe("Transformer", () => {
    describe("Default Transformation", () => {
        it("Should be able to transform Class/Method/:Parameter", () => {
            let meta = H.fromFile("./test/transformers/dummy/simple-controller.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/mygetaction/:par1/:par2',
                httpMethod: 'GET',
                methodName: 'myGetAction',
                parameters: ['par1', 'par2'],
                className: 'SimpleController, ./test/transformers/dummy/simple-controller.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodName: 'myOtherGetAction',
                parameters: ['par1'],
                className: 'SimpleController, ./test/transformers/dummy/simple-controller.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/myactionwithoutparameter',
                httpMethod: 'GET',
                methodName: 'myActionWithoutParameter',
                parameters: [],
                className: 'SimpleController, ./test/transformers/dummy/simple-controller.js',
                collaborator: ['Controller']
            }])
        })

        it("Should be able to transform Deep Module Module/Class/Method/:Parameter", () => {
            let meta = H.fromFile("./test/transformers/dummy/deep-module.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'DefaultAction',
                route: '/parentmodule/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodName: 'myOtherGetAction',
                parameters: ['par1'],
                className: 'SimpleController, ./test/transformers/dummy/deep-module.js',
                collaborator: ['Controller', 'Module']
            },
            {
                initiator: 'DefaultAction',
                route: '/parentmodule/innermodule/simple/myactionwithoutparameter',
                httpMethod: 'GET',
                methodName: 'myActionWithoutParameter',
                parameters: [],
                className: 'SimpleController, ./test/transformers/dummy/deep-module.js',
                collaborator: ['Controller', 'Module', 'Module']
            }])
        })

        it("Should OK for class without 'Controller' prefix", () => {
            let meta = H.fromFile("./test/transformers/dummy/non-controller-name.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'DefaultAction',
                route: '/controllerwithoutprefix/mygetaction/:par1',
                httpMethod: 'GET',
                methodName: 'myGetAction',
                parameters: ['par1'],
                className: 'ControllerWithoutPrefix, ./test/transformers/dummy/non-controller-name.js',
                collaborator: ['Controller']
            }])
        })

        it("Should not transform non exported class", () => {
            let meta = H.fromFile("./test/transformers/dummy/non-exported-class.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodName: 'myOtherGetAction',
                parameters: ['par1'],
                className: 'SimpleController, ./test/transformers/dummy/non-exported-class.js',
                collaborator: ['Controller']
            }])
        })

        it("Should not transform non exported on Deep Module", () => {
            let meta = H.fromFile("./test/transformers/dummy/non-exported-deep-module.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'DefaultAction',
                route: '/parentmodule/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodName: 'myOtherGetAction',
                parameters: ['par1'],
                className: 'SimpleController, ./test/transformers/dummy/non-exported-deep-module.js',
                collaborator: ['Controller', 'Module']
            }])
        })
    })

    describe("Internal Decorator", () => {
        it("Should transform @internal action", () => {
            let meta = H.fromFile("./test/transformers/dummy/internal-decorators.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/publicmethod/:par1',
                httpMethod: 'GET',
                methodName: 'publicMethod',
                parameters: ['par1'],
                className: 'SimpleController, ./test/transformers/dummy/internal-decorators.js',
                collaborator: ['Controller']
            }])
        })

        it("Should detect conflict @internal and @http.<any>()", () => {
            let meta = H.fromFile("./test/transformers/dummy/internal-conflict.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                analysis: [Core.RouteAnalysisCode.ConflictDecorators],
                methodName: 'privateMethod',
                parameters: ['par1', 'par2'],
                httpMethod: 'GET',
                initiator: 'InternalDecorator',
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/internal-conflict.js'
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/publicmethod/:par1',
                httpMethod: 'GET',
                methodName: 'publicMethod',
                parameters: ['par1'],
                className: 'SimpleController, ./test/transformers/dummy/internal-conflict.js',
                collaborator: ['Controller']
            }])
        })

    })

    describe("Http Decorator", () => {
        it("Should transform @http decorator", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorators.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'getMethod',
                route: 'this/get/got/different',
                parameters: [],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'POST',
                methodName: 'postMethod',
                route: 'this/post/got/different',
                parameters: [],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'PUT',
                methodName: 'putMethod',
                route: 'this/put/got/different',
                parameters: [],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'DELETE',
                methodName: 'deleteMethod',
                route: 'this/delete/got/different',
                parameters: [],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js'
            }])
        })

        it("Should identify parameter association issue", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorator-param-issue.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'actionHaveNoParameter',
                route: 'route/got/:parameter',
                parameters: [],
                analysis: [
                    Core.RouteAnalysisCode.MissingActionParameters,
                    Core.RouteAnalysisCode.UnAssociatedParameters
                ],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-param-issue.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'postMethod',
                route: 'route/:associated/:notAssociated',
                parameters: ['associated'],
                analysis: [Core.RouteAnalysisCode.UnAssociatedParameters],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-param-issue.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'actionHaveParameter',
                route: 'route/have/no/parameter',
                parameters: ['parameter'],
                analysis: [Core.RouteAnalysisCode.MissingRouteParameters],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-param-issue.js'
            }])
        })

        it("Should allow multiple decorators", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorator-multiple.js")
            let result = Transformer.transform(meta);
            Chai.expect(result).deep.eq([{
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'actionHaveNoParameter',
                route: 'this/is/the/first/route',
                parameters: [],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'actionHaveNoParameter',
                route: 'this/is/the/other/route',
                parameters: [],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'actionWithParameter',
                route: 'this/is/:parameter',
                parameters: ['parameter'],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js'
            },
            {
                initiator: 'HttpMethodDecorator',
                httpMethod: 'GET',
                methodName: 'actionWithParameter',
                route: 'the/:parameter/in/the/middle',
                parameters: ['parameter'],
                analysis: [],
                collaborator: ['DefaultAction', 'Controller'],
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js'
            }])
        })

        it("Empty http decorator parameter should fall back to default action generator", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorator-multiple.js")
            let result = Transformer.transform(meta);
            console.log(result)
            Chai.expect(result).deep.eq(null)
        })
    })

})

