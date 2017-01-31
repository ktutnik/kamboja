import { Router } from "../../src/router"
import { DefaultIdentifierResolver } from "../../src/resolver/identifier-resolver"
import * as Chai from "chai"
import * as H from "../helper"

describe("Router", () => {
    it("Should load routes from controllers properly", async () => {
        let test = new Router(["test/router/api", "test/router/controller"], new DefaultIdentifierResolver())
        let routes = await test.getRoutes()
        let clean = H.cleanUp(routes.result)
        Chai.expect(clean).deep.eq([{
            baseClass: "ApiController",
            initiator: 'ApiConvention',
            route: '/dummyapi/page/:offset/:pageSize',
            httpMethod: 'GET',
            methodMetaData: { name: 'getByPage' },
            className: 'DummyApi, test/router/api/dummy-api.js',
            collaborator: ['Controller']
        },
        {
            baseClass: "Controller",
            initiator: 'DefaultAction',
            route: '/dummy/getdata/:offset/:pageSize',
            httpMethod: 'GET',
            methodMetaData: { name: 'getData' },
            className: 'DummyController, test/router/controller/dummy-controller.js',
            collaborator: ['Controller']
        }])
    })

    it("Should throw error when provided path not found", async () => {
        let test = new Router(["test/fake/path", "test/router/controller"], new DefaultIdentifierResolver())
        let thrown = false;
        try{
            await test.getRoutes();
            thrown = false
        }
        catch(e){
            thrown = true;
        }
        Chai.expect(thrown).true;
    })
})
