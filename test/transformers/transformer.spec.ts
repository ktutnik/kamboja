import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as Core from "../../src/core"
import * as H from "../helper"
import * as Transformer from "../../src/transformers"
import * as Util from "util"
import * as Dash from "lodash"



describe("Transformer", () => {
    describe("Default Transformation", () => {
        it("Should be able to transform Class/Method/:Parameter", () => {
            let meta = H.fromFile("./test/transformers/dummy/simple-controller.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/mygetaction/:par1/:par2',
                httpMethod: 'GET',
                methodMetaData: { name: 'myGetAction' },
                className: 'SimpleController, ./test/transformers/dummy/simple-controller.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodMetaData: { name: 'myOtherGetAction' },
                className: 'SimpleController, ./test/transformers/dummy/simple-controller.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/myactionwithoutparameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'myActionWithoutParameter' },
                className: 'SimpleController, ./test/transformers/dummy/simple-controller.js',
                collaborator: ['Controller']
            }])
        })

        it("Should not transform class that not inherited from Controller", () => {
            let meta = H.fromFile("./test/transformers/dummy/non-controller.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean[0].analysis[0]).eq(Core.RouteAnalysisCode.ClassNotInherritedFromController)
            Chai.expect(clean[1].analysis[0]).eq(Core.RouteAnalysisCode.ClassNotInherritedFromController)
        })

        it("Should be able to transform Deep Module Module/Class/Method/:Parameter", () => {
            let meta = H.fromFile("./test/transformers/dummy/deep-module.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/parentmodule/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodMetaData: { name: 'myOtherGetAction' },
                className: 'SimpleController, ./test/transformers/dummy/deep-module.js',
                collaborator: ['Controller', 'Module']
            },
            {
                initiator: 'DefaultAction',
                route: '/parentmodule/innermodule/simple/myactionwithoutparameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'myActionWithoutParameter' },
                className: 'SimpleController, ./test/transformers/dummy/deep-module.js',
                collaborator: ['Controller', 'Module', 'Module']
            }])
        })

        it("Should OK for class without 'Controller' prefix", () => {
            let meta = H.fromFile("./test/transformers/dummy/non-controller-name.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/controllerwithoutprefix/mygetaction/:par1',
                httpMethod: 'GET',
                methodMetaData: { name: 'myGetAction' },
                className: 'ControllerWithoutPrefix, ./test/transformers/dummy/non-controller-name.js',
                collaborator: ['Controller']
            }])
        })

        it("Should not transform non exported class", () => {
            let meta = H.fromFile("./test/transformers/dummy/non-exported-class.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'Controller',
                route: undefined,
                httpMethod: undefined,
                methodMetaData: { name: '' },
                className: 'NonExportedController, ./test/transformers/dummy/non-exported-class.js',
                collaborator: undefined,
                analysis: [Core.RouteAnalysisCode.ClassNotExported]
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodMetaData: { name: 'myOtherGetAction' },
                className: 'SimpleController, ./test/transformers/dummy/non-exported-class.js',
                collaborator: ['Controller']
            }])
        })

        it("Should not transform non exported on Deep Module", () => {
            let meta = H.fromFile("./test/transformers/dummy/non-exported-deep-module.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/parentmodule/simple/myothergetaction/:par1',
                httpMethod: 'GET',
                methodMetaData: { name: 'myOtherGetAction' },
                className: 'SimpleController, ./test/transformers/dummy/non-exported-deep-module.js',
                collaborator: ['Controller', 'Module']
            },
            {
                initiator: 'DefaultAction',
                route: '/parentmodule/innermodule/simple/myactionwithoutparameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'myActionWithoutParameter' },
                className: 'SimpleController, ./test/transformers/dummy/non-exported-deep-module.js',
                collaborator: ['Controller', 'Module', 'Module'],
                analysis: [Core.RouteAnalysisCode.ClassNotExported]
            }])
        })
    })

    describe("Internal Decorator", () => {
        it("Should transform @internal action", () => {
            let meta = H.fromFile("./test/transformers/dummy/internal-decorators.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/publicmethod/:par1',
                httpMethod: 'GET',
                methodMetaData: { name: 'publicMethod' },
                className: 'SimpleController, ./test/transformers/dummy/internal-decorators.js',
                collaborator: ['Controller']
            }])
        })

        it("Should detect conflict @internal and @http.<any>()", () => {
            let meta = H.fromFile("./test/transformers/dummy/internal-conflict.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'InternalDecorator',
                route: undefined,
                httpMethod: 'GET',
                methodMetaData: { name: 'privateMethod' },
                className: 'SimpleController, ./test/transformers/dummy/internal-conflict.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [4]
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/publicmethod/:par1',
                httpMethod: 'GET',
                methodMetaData: { name: 'publicMethod' },
                className: 'SimpleController, ./test/transformers/dummy/internal-conflict.js',
                collaborator: ['Controller']
            }])
        })

    })

    describe("Http Decorator", () => {
        it("Should transform @http decorator", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorators.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: 'this/get/got/different',
                httpMethod: 'GET',
                methodMetaData: { name: 'getMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'this/post/got/different',
                httpMethod: 'POST',
                methodMetaData: { name: 'postMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'this/put/got/different',
                httpMethod: 'PUT',
                methodMetaData: { name: 'putMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'this/delete/got/different',
                httpMethod: 'DELETE',
                methodMetaData: { name: 'deleteMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorators.js',
                collaborator: ['DefaultAction', 'Controller']
            }])
        })

        it("Should identify parameter association issue", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorator-param-issue.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: 'route/got/:parameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionHaveNoParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-param-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [
                    Core.RouteAnalysisCode.MissingActionParameters,
                    Core.RouteAnalysisCode.UnAssociatedParameters
                ]
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'route/:associated/:notAssociated',
                httpMethod: 'GET',
                methodMetaData: { name: 'postMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-param-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [Core.RouteAnalysisCode.UnAssociatedParameters]
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'route/have/no/parameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionHaveParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-param-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [Core.RouteAnalysisCode.MissingRouteParameters]
            }])
        })

        it("Should allow multiple decorators", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorator-multiple.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: 'this/is/the/first/route',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionHaveNoParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'this/is/the/other/route',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionHaveNoParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'this/is/:parameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionWithParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'the/:parameter/in/the/middle',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionWithParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple.js',
                collaborator: ['DefaultAction', 'Controller']
            }])
        })

        it("Empty http decorator parameter should fall back to default action generator", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorator-no-parameter.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: '/simple/getmethod',
                httpMethod: 'GET',
                methodMetaData: { name: 'getMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-no-parameter.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: '/simple/postmethod/:params',
                httpMethod: 'POST',
                methodMetaData: { name: 'postMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-no-parameter.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: '/simple/putmethod',
                httpMethod: 'PUT',
                methodMetaData: { name: 'putMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-no-parameter.js',
                collaborator: ['DefaultAction', 'Controller']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: '/simple/deletemethod',
                httpMethod: 'DELETE',
                methodMetaData: { name: 'deleteMethod' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-no-parameter.js',
                collaborator: ['DefaultAction', 'Controller']
            }])
        })

        it("Should check parameters association issue on multiple decorators", () => {
            let meta = H.fromFile("./test/transformers/dummy/http-decorator-multiple-issue.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: 'this/is/the/first/route/:nonPar',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionHaveNoParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [Core.RouteAnalysisCode.UnAssociatedParameters]
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'this/is/the/:nonPar/route',
                httpMethod: 'GET',
                methodMetaData: { name: 'actionHaveNoParameter' },
                className: 'SimpleController, ./test/transformers/dummy/http-decorator-multiple-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [Core.RouteAnalysisCode.UnAssociatedParameters]
            }])
        })
    })

    describe("ApiConvention", () => {
        it("Should transform API Convention properly", () => {
            let meta = H.fromFile("./test/transformers/dummy/api-convention.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/simple/page/:offset/:pageWidth',
                httpMethod: 'GET',
                methodMetaData: { name: 'getByPage' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple',
                httpMethod: 'POST',
                methodMetaData: { name: 'add' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'PUT',
                methodMetaData: { name: 'modify' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention.js',
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'DELETE',
                methodMetaData: { name: 'delete' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention.js',
                collaborator: ['Controller']
            }])

        })

        it("Should identify missing parameter which cause issue", () => {
            let meta = H.fromFile("./test/transformers/dummy/api-convention-parameter-issue.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/simple/getbypage',
                httpMethod: 'GET',
                methodMetaData: { name: 'getByPage' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-parameter-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [5]
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/get',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-parameter-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [5]
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/add',
                httpMethod: 'GET',
                methodMetaData: { name: 'add' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-parameter-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [5]
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/modify',
                httpMethod: 'GET',
                methodMetaData: { name: 'modify' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-parameter-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [5]
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/delete',
                httpMethod: 'GET',
                methodMetaData: { name: 'delete' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-parameter-issue.js',
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [5]
            }])
        })

        it("Should fall back to default transformer if name doesn't match", () => {
            let meta = H.fromFile("./test/transformers/dummy/api-convention-free-name.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/thisisfreeactionname/:offset/:pageWidth',
                httpMethod: 'GET',
                methodMetaData: { name: 'thisIsFreeActionName' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-free-name.js',
                collaborator: ['Controller']
            }])
        })

        it("Should support @internal decorator", () => {
            let meta = H.fromFile("./test/transformers/dummy/api-convention-with-internal.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-with-internal.js',
                collaborator: ['Controller']
            }])
        })

        it("Should prioritized @http.<any> decorators", () => {
            let meta = H.fromFile("./test/transformers/dummy/api-convention-with-http-decorator.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: '/simple/getbypage/:offset/:pageWidth',
                httpMethod: 'GET',
                methodMetaData: { name: 'getByPage' },
                className: 'SimpleController, ./test/transformers/dummy/api-convention-with-http-decorator.js',
                collaborator: ['DefaultAction', 'Controller']
            }])
        })
    })
})