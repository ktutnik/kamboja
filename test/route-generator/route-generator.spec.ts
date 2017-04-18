import { RouteGenerator } from "../../src/route-generator"
import { DefaultIdentifierResolver, DefaultDependencyResolver, DefaultPathResolver } from "../../src/resolver/"
import * as Chai from "chai"
import * as H from "../helper"
import * as Fs from "fs"
import * as Core from "../../src/core"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { RequiredValidator } from "../../src/validator"
import * as Util from "util"


describe("RouteGenerator", () => {
    let idResolver: Core.IdentifierResolver;
    let pathResolver: Core.PathResolver;

    let metadataStorage: MetaDataLoader
    beforeEach(() => {
        idResolver = new DefaultIdentifierResolver()
        pathResolver = new DefaultPathResolver(__dirname)
        metadataStorage = new MetaDataLoader(idResolver, pathResolver)
        metadataStorage.load(["api",
            "controller"], "Controller")
    })
    
    it("Should load routes from controllers properly", () => {
        let test = new RouteGenerator(idResolver, metadataStorage.getFiles("Controller"))
        let routes = test.getRoutes()
        let clean = H.cleanUp(routes)
        Chai.expect(clean).deep.eq([{
            initiator: 'ApiConvention',
            route: '/dummyapi',
            httpMethod: 'GET',
            methodMetaData: { name: 'list' },
            qualifiedClassName: 'DummyApi, api/dummy-api',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/dummyapi/:id',
            httpMethod: 'GET',
            methodMetaData: { name: 'get' },
            qualifiedClassName: 'DummyApi, api/dummy-api',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/dummyapi',
            httpMethod: 'POST',
            methodMetaData: { name: 'add' },
            qualifiedClassName: 'DummyApi, api/dummy-api',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/dummyapi',
            httpMethod: 'PUT',
            methodMetaData: { name: 'replace' },
            qualifiedClassName: 'DummyApi, api/dummy-api',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/dummyapi/:id',
            httpMethod: 'PATCH',
            methodMetaData: { name: 'modify' },
            qualifiedClassName: 'DummyApi, api/dummy-api',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/dummyapi/:id',
            httpMethod: 'DELETE',
            methodMetaData: { name: 'delete' },
            qualifiedClassName: 'DummyApi, api/dummy-api',
            classMetaData: { name: 'DummyApi', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'DefaultAction',
            route: '/dummy/getdata',
            httpMethod: 'GET',
            methodMetaData: { name: 'getData' },
            qualifiedClassName: 'DummyController, controller/dummy-controller',
            classMetaData: { name: 'DummyController', baseClass: 'Controller' },
            collaborator: ['Controller']
        }])
    })

})
