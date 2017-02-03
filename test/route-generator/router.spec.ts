import { RouteGenerator } from "../../src/route-generator"
import { DefaultIdentifierResolver } from "../../src/resolver/identifier-resolver"
import * as Chai from "chai"
import * as H from "../helper"
import * as Fs from "fs"

describe("Router", () => {
    it("Should load routes from controllers properly", async () => {
        let test = new RouteGenerator(["test/route-generator/api",
            "test/route-generator/controller"],
            new DefaultIdentifierResolver(), Fs.readFile)
        let routes = await test.getRoutes()
        let clean = H.cleanUp(routes.result)
        Chai.expect(clean).deep.eq([{
            initiator: 'ApiConvention',
            route: '/dummyapi/page/:offset/:pageSize',
            httpMethod: 'GET',
            methodMetaData: { name: 'getByPage' },
            qualifiedClassName: 'DummyApi, test/route-generator/api/dummy-api.js',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'DefaultAction',
            route: '/dummy/getdata/:offset/:pageSize',
            httpMethod: 'GET',
            methodMetaData: { name: 'getData' },
            qualifiedClassName: 'DummyController, test/route-generator/controller/dummy-controller.js',
            classMetaData: { name: 'DummyController', baseClass: 'Controller' },
            collaborator: ['Controller']
        }])
    })

    it("Should throw error when provided path not found", async () => {
        let test = new RouteGenerator(["test/fake/path",
            "test/route-generator/controller"],
            new DefaultIdentifierResolver(), Fs.readFile)
        let thrown = false;
        try {
            await test.getRoutes();
            thrown = false
        }
        catch (e) {
            thrown = true;
        }
        Chai.expect(thrown).true;
    })

    it("Should handle read file error", async () => {
        let test = new RouteGenerator(["test/route-generator/api", "test/route-generator/controller"],
            new DefaultIdentifierResolver(), H.errorReadFile)
        let thrown = false;
        try {
            await test.getRoutes();
            thrown = false
        }
        catch (e) {
            thrown = true;
        }
        Chai.expect(thrown).true;
    })
})
