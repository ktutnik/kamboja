import { RouteGenerator } from "../../src/route-generator"
import { DefaultIdentifierResolver, DefaultDependencyResolver } from "../../src/resolver/"
import * as Chai from "chai"
import * as H from "../helper"
import * as Fs from "fs"
import * as Core from "../../src/core"
import { InMemoryMetaDataStorage } from "../../src/metadata-storage"
import { RequiredValidator } from "../../src/validator"

let facade: Core.Facade = {
    idResolver: new DefaultIdentifierResolver(),
    resolver: new DefaultDependencyResolver(new DefaultIdentifierResolver()),
    metadataStorage: new InMemoryMetaDataStorage(new DefaultIdentifierResolver()),
    validators: [
        new RequiredValidator()
    ]
}

describe("RouteGenerator", () => {
    let idResolver: Core.IdentifierResolver;
    let metadataStorage: Core.MetaDataStorage
    beforeEach(() => {
        idResolver = new DefaultIdentifierResolver()
        metadataStorage = new InMemoryMetaDataStorage(idResolver)
    })
    it("Should load routes from controllers properly", () => {
        let test = new RouteGenerator(["test/route-generator/api",
            "test/route-generator/controller"], idResolver, metadataStorage, Fs.readFileSync)
        let routes = test.getRoutes()
        let clean = H.cleanUp(routes)
        Chai.expect(routes[0].classId.replace(/\\/g, "/")).eq("DummyApi, test/route-generator/api/dummy-api.js")
        Chai.expect(routes[1].classId.replace(/\\/g, "/")).eq("DummyController, test/route-generator/controller/dummy-controller.js")
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

    it("Should skip when provided path not found", () => {
        let test = new RouteGenerator(["test/fake/path",
            "test/route-generator/controller"],
            idResolver, metadataStorage, Fs.readFileSync)
        let result = test.getRoutes();
        Chai.expect(result.length).eq(1);
    })

    it("Should handle read file error", () => {
        let test = new RouteGenerator(["test/route-generator/api", "test/route-generator/controller"],
            idResolver, metadataStorage, H.errorReadFile)
        let thrown = false;
        try {
            test.getRoutes();
            thrown = false
        }
        catch (e) {
            thrown = true;
        }
        Chai.expect(thrown).true;
    })
})
