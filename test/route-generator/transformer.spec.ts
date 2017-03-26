import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as Core from "../../src/core"
import * as H from "../helper"
import * as Transformer from "../../src/route-generator/transformers"
import * as Util from "util"
import * as Dash from "lodash"

describe("Transformer", () => {
    describe("Default Transformation", () => {
        it("Should be able to transform Class/Method/:Parameter", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/simple-controller.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/index',
                httpMethod: 'GET',
                methodMetaData: { name: 'index' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/simple-controller.js',
                classMetaData: { name: 'SimpleController', baseClass: 'Controller' },
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/mygetaction',
                httpMethod: 'GET',
                methodMetaData: { name: 'myGetAction' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/simple-controller.js',
                classMetaData: { name: 'SimpleController', baseClass: 'Controller' },
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/myactionwithoutparameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'myActionWithoutParameter' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/simple-controller.js',
                classMetaData: { name: 'SimpleController', baseClass: 'Controller' },
                collaborator: ['Controller']
            }])
        })

        it("Should not transform class that not inherited from Controller", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/non-controller.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean[0].analysis[0]).eq(Core.RouteAnalysisCode.ClassNotInheritedFromController)
            Chai.expect(clean[1].analysis[0]).eq(Core.RouteAnalysisCode.ClassNotInheritedFromController)
        })

        it("Should be able to transform Deep Module Module/Class/Method/:Parameter", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/deep-module.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/parentmodule/simple/myothergetaction')
            Chai.expect(result[1].route).eq('/parentmodule/innermodule/simple/myactionwithoutparameter')
        })

        it("Should OK for class without 'Controller' prefix", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/non-controller-name.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/controllerwithoutprefix/mygetaction')
        })

        it("Should not transform non exported class", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/non-exported-class.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).undefined
            Chai.expect(result[0].analysis).deep.eq([Core.RouteAnalysisCode.ClassNotExported])
            Chai.expect(result[1].route).eq("/simple/myothergetaction")
        })

        it("Should not transform non exported on Deep Module", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/non-exported-deep-module.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/parentmodule/simple/myothergetaction')
            Chai.expect(result[1].route).eq('/parentmodule/innermodule/simple/myactionwithoutparameter')
            Chai.expect(result[1].analysis).deep.eq([Core.RouteAnalysisCode.ClassNotExported])
            Chai.expect(result[2].route).undefined
            Chai.expect(result[2].analysis).deep.eq([
                Core.RouteAnalysisCode.ClassNotInheritedFromController,
                Core.RouteAnalysisCode.ClassNotExported])
        })

        it("Should give correct analysis in Deep Module", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/issue-with-non-valid-module.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('this/is/the/:nonPar/route')
            Chai.expect(result[0].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters,
                Core.RouteAnalysisCode.ClassNotExported
            ])
        })
    })

    describe("Internal Decorator", () => {
        it("Should not transform @internal action", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/internal-decorators.js")
            let result = Transformer.transform(meta);
            let info = result.filter(x => x.methodMetaData.name == "privateMethod")
            Chai.expect(info.length).eq(0);
        })

        it("Should detect conflict @internal and @http.<any>()", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/internal-conflict.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(result[0].route).undefined
            Chai.expect(result[0].analysis).deep.eq([Core.RouteAnalysisCode.ConflictDecorators])
        })

    })

    describe("Http Decorator", () => {
        it("Should transform @http decorator", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/http-decorators.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("this/get/got/different")
            Chai.expect(result[0].httpMethod).eq("GET")
            Chai.expect(result[1].route).eq("this/post/got/different")
            Chai.expect(result[1].httpMethod).eq("POST")
            Chai.expect(result[2].route).eq("this/put/got/different")
            Chai.expect(result[2].httpMethod).eq("PUT")
            Chai.expect(result[3].route).eq("this/delete/got/different")
            Chai.expect(result[3].httpMethod).eq("DELETE")
        })

        it("Should identify parameter association issue", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/http-decorator-param-issue.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('route/got/:parameter')
            Chai.expect(result[0].analysis).deep.eq([
                Core.RouteAnalysisCode.MissingActionParameters,
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[1].route).eq('route/:associated/:notAssociated')
            Chai.expect(result[1].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[2].route).eq('route/have/no/parameter')
            Chai.expect(result[2].analysis).deep.eq([
                Core.RouteAnalysisCode.MissingRouteParameters,
            ])
        })

        it("Should allow multiple decorators", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/http-decorator-multiple.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('this/is/the/first/route')
            Chai.expect(result[0].methodMetaData.name).eq('actionHaveNoParameter')
            Chai.expect(result[1].route).eq('this/is/the/other/route')
            Chai.expect(result[1].methodMetaData.name).eq('actionHaveNoParameter')
            Chai.expect(result[2].route).eq('this/is/:parameter')
            Chai.expect(result[2].methodMetaData.name).eq('actionWithParameter')
            Chai.expect(result[3].route).eq('the/:parameter/in/the/middle')
            Chai.expect(result[3].methodMetaData.name).eq('actionWithParameter')
        })

        it("Empty http decorator parameter should fall back to default action generator", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/http-decorator-no-parameter.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("/simple/getmethod")
            Chai.expect(result[0].httpMethod).eq("GET")
            Chai.expect(result[0].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[0].collaborator.some(x => x == "DefaultAction")).true
            Chai.expect(result[1].route).eq("/simple/postmethod")
            Chai.expect(result[1].httpMethod).eq("POST")
            Chai.expect(result[1].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[1].collaborator.some(x => x == "DefaultAction")).true
            Chai.expect(result[2].route).eq("/simple/putmethod")
            Chai.expect(result[2].httpMethod).eq("PUT")
            Chai.expect(result[2].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[2].collaborator.some(x => x == "DefaultAction")).true
            Chai.expect(result[3].route).eq("/simple/deletemethod")
            Chai.expect(result[3].httpMethod).eq("DELETE")
            Chai.expect(result[3].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[3].collaborator.some(x => x == "DefaultAction")).true
        })

        it("Should check parameters association issue on multiple decorators", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/http-decorator-multiple-issue.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(result[0].route).eq("this/is/the/first/route/:nonPar")
            Chai.expect(result[0].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[0].methodMetaData.name).eq("actionHaveNoParameter")
            Chai.expect(result[1].route).eq("this/is/the/:nonPar/route")
            Chai.expect(result[1].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[1].methodMetaData.name).eq("actionHaveNoParameter")
        })
    })

    describe("ApiConvention", () => {
        it("Should transform API Convention properly", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/api-convention.js")
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/simple',
                httpMethod: 'GET',
                methodMetaData: { name: 'list' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple',
                httpMethod: 'POST',
                methodMetaData: { name: 'add' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'PUT',
                methodMetaData: { name: 'replace' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'PATCH',
                methodMetaData: { name: 'modify' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'DELETE',
                methodMetaData: { name: 'delete' },
                qualifiedClassName: 'SimpleController, ./test/route-generator/transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            }])
        })

        it("Should identify missing parameter and give Convention Fail warning", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/api-convention-parameter-issue.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("/simple/list")
            Chai.expect(result[0].httpMethod).eq("GET")
            Chai.expect(result[0].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[1].route).eq("/simple/get")
            Chai.expect(result[1].httpMethod).eq("GET")
            Chai.expect(result[1].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[2].route).eq("/simple/add")
            Chai.expect(result[2].httpMethod).eq("GET")
            Chai.expect(result[2].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[3].route).eq("/simple/modify")
            Chai.expect(result[3].httpMethod).eq("GET")
            Chai.expect(result[3].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[4].route).eq("/simple/replace")
            Chai.expect(result[4].httpMethod).eq("GET")
            Chai.expect(result[4].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[5].route).eq("/simple/delete")
            Chai.expect(result[5].httpMethod).eq("GET")
            Chai.expect(result[5].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
        })

        it("Should fall back to default transformer if name doesn't match", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/api-convention-free-name.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/simple/thisisfreeactionname')
            Chai.expect(result[0].initiator).eq("DefaultAction")
        })

        it("Should support @internal decorator", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/api-convention-with-internal.js")
            let result = Transformer.transform(meta);
            let info = result.filter(x => x.methodMetaData.name == "getByPage")
            Chai.expect(info.length).eq(0)
        })

        it("Should prioritized @http.<any> decorators", () => {
            let meta = H.fromFile("./test/route-generator/transformer-dummy/api-convention-with-http-decorator.js")
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("/simple/getbypage")
            Chai.expect(result[0].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[0].collaborator.some(x => x == "DefaultAction")).true
        })
    })
})