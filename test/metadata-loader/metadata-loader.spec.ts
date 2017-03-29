import * as Chai from "chai"
import * as Core from "../../src/core"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { DefaultIdentifierResolver } from "../../src/resolver"
import * as H from "../helper"
import { Kamboja } from "../../src/kamboja"

describe("MetaDataLoader", () => {

    describe("load", () => {
        let loader: MetaDataLoader;

        beforeEach(() => {
            Kamboja.getOptions({ rootPath: __dirname })
            loader = <MetaDataLoader>Kamboja.getOptions().metaDataStorage
        })

        it("Should load classes properly", () => {
            loader.load("controller", "Controller")
            let result = loader.getFiles("Controller")
            Chai.expect(result.length).eq(2)
        })

        it("Should able to load from multiple directory", () => {
            loader.load(["controller", "model"], "Controller")
            let result = loader.getFiles("Controller")
            Chai.expect(result.length).eq(3)
        })

        it("Should throw when directory not found on load controller", () => {
            Chai.expect(() => {
                loader.load(["controller", "not/a/directory"], "Controller")
            }).throw(/Directory not found/)
        })

        it("Should not throw when directory found on load model", () => {
            loader.load(["not/a/directory"], "Model")
            let result = loader.getClasses("Model")
            Chai.expect(result.length).eq(0)
        })
    })

    describe("get", () => {
        let storage: MetaDataLoader;

        beforeEach(() => {
            storage = <MetaDataLoader>Kamboja.getOptions().metaDataStorage
        })

        it("Should return class by qualified name properly", () => {
            storage.load("controller", "Controller")
            let result = storage.get("DummyController, controller/dummy-controller.js")
            Chai.expect(result.name).eq("DummyController")
        })

        it("Should provide qualifiedClassName properly", () => {
            storage.load("controller", "Controller")
            let result = storage.get("DummyController, controller/dummy-controller.js")
            Chai.expect(result.qualifiedClassName).eq("DummyController, controller/dummy-controller")
        })

        it("Should not return if provided wrong namespace", () => {
            storage.load("controller", "Controller")
            let result = storage.get("MyNamespace.DummyController, controller/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error if provided namespace without classes", () => {
            storage.load("no-class", "Controller")
            let result = storage.getClasses("Controller")
            Chai.expect(result.length).eq(0)
        })

        it("Should return class by qualified name in deep namespace", () => {
            storage.load("with-deep-namespace", "Controller")
            let result = storage.get("MyParentNamespace.MyChildNamespace.DummyController, with-deep-namespace/dummy-controller.js")
            Chai.expect(result.name).eq("DummyController")
        })

        it("Should not return class if provided only class name on deep namespace", () => {
            storage.load("with-deep-namespace", "Controller")
            let result = storage.get("DummyController, with-deep-namespace/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error when no classes found", () => {
            storage.load("controller", "Controller")
            let result = storage.get("OtherNonExistController, controller/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error when no file found", () => {
            storage.load("controller", "Controller")
            let result = storage.get("DummyController, not/the/correct/path")
            Chai.expect(result).undefined
        })
    })
})
