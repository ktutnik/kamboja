import { ControllerFactory } from "../../src/engine/controller-factory"
import { DefaultPathResolver } from "../../src/resolver"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import { CustomValidation } from "./validator/custom-validator"
import { Kamboja, Core } from "../../src"

describe("Controller Factory", () => {
    let facade: Core.Facade
    beforeEach(() => {
        facade = H.createFacade(__dirname)
    })

    it("Should provide controller properly", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.createController()).not.null
    })

    it("Should throw if provided invalid classId", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = "InvalidClass, invalid/path"
        let container = new ControllerFactory(facade, info)
        Chai.expect(() => {
            container.createController()
        }).throw("Can not instantiate [InvalidClass, invalid/path] as Controller")
    })

    it("Should provide custom validator properly", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = [new CustomValidation()]
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.getValidatorCommands().length).eq(1)
    })

    it("Should provide custom validator using qualified class name", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = ["CustomValidation, validator/custom-validator"]
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.getValidatorCommands().length).eq(1)
    })

    it("Should throw if provided invalid validator qualified class name", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = ["Invalid, test/invalid/path"]
        let factory = new ControllerFactory(facade, info);
        Chai.expect(() => factory.createValidatorForParameters([0])).throw("Can not instantiate custom validator [Invalid, test/invalid/path]")
    })

    
})