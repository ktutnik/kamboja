import { RouteGenerator } from "../../src/route-generator"
import { DefaultIdentifierResolver, DefaultDependencyResolver } from "../../src/resolver/"
import * as Chai from "chai"
import * as H from "../helper"
import * as Fs from "fs"
import * as Core from "../../src/core"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { RequiredValidator } from "../../src/validator"


describe("RouteGenerator", () => {
    let idResolver: Core.IdentifierResolver;
    let metadataStorage: MetaDataLoader
    beforeEach(() => {
        idResolver = new DefaultIdentifierResolver()
        metadataStorage = new MetaDataLoader(idResolver)
        metadataStorage.load(["test/route-generator/api",
            "test/route-generator/controller"], "Controller")
    })
    it("Should load routes from controllers properly", () => {
        let test = new RouteGenerator(idResolver, metadataStorage.getByCategory("Controller"))
        let routes = test.getRoutes()
        let clean = H.cleanUp(routes)
        Chai.expect(clean).deep.eq([{
            initiator: 'ApiConvention',
            route: '/dummyapi/page/:offset/:pageSize',
            httpMethod: 'GET',
            methodMetaData: { name: 'getByPage' },
            qualifiedClassName: 'DummyApi, test/route-generator/api/dummy-api',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'DefaultAction',
            route: '/dummy/getdata/:offset/:pageSize',
            httpMethod: 'GET',
            methodMetaData: { name: 'getData' },
            qualifiedClassName: 'DummyController, test/route-generator/controller/dummy-controller',
            classMetaData: { name: 'DummyController', baseClass: 'Controller' },
            collaborator: ['Controller']
        }])
    })

})
