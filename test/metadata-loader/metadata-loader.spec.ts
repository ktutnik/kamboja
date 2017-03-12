import * as Chai from "chai"
import * as Core from "../../src/core"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { DefaultIdentifierResolver } from "../../src/resolver"
import * as H from "../helper"

describe("MetaDataLoader", () => {

    describe("load", () => {

        it("Should load classes properly", () => {
            let loader = new MetaDataLoader(new DefaultIdentifierResolver())
            loader.load("test/metadata-loader/controller", "Controller")
            let result = loader.getFiles("Controller")
            Chai.expect(result.length).eq(2)
        })

        it("Should able to load from multiple directory", () => {
            let loader = new MetaDataLoader(new DefaultIdentifierResolver())
            loader.load(["test/metadata-loader/controller", "test/metadata-loader/model"], "Controller")
            let result = loader.getFiles("Controller")
            Chai.expect(result.length).eq(3)
        })

        it("Should throw when directory not found on load controller", () => {
            let loader = new MetaDataLoader(new DefaultIdentifierResolver())
            Chai.expect(() => {
                loader.load(["test/metadata-loader/controller", "not/a/directory"], "Controller")
            }).throw(/Directory not found/)
        })

        it("Should not throw when directory found on load model", () => {
            let loader = new MetaDataLoader(new DefaultIdentifierResolver())
            loader.load(["not/a/directory"], "Model")
            let result = loader.getClasses("Model")
            Chai.expect(result.length).eq(0)
        })
    })

    describe("get", () => {
        it("Should return class by qualified name properly", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/controller", "Controller")
            let result = storage.get("DummyController, test/metadata-loader/controller/dummy-controller.js")
            Chai.expect(result.name).eq("DummyController")
        })

        it("Should provide qualifiedClassName properly", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/controller", "Controller")
            let result = storage.get("DummyController, test/metadata-loader/controller/dummy-controller.js")
            Chai.expect(result.qualifiedClassName).eq("DummyController, test/metadata-loader/controller/dummy-controller")
        })

        it("Should not return if provided wrong namespace", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/controller", "Controller")
            let result = storage.get("MyNamespace.DummyController, test/metadata-loader/controller/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error if provided namespace without classes", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/no-class", "Controller")
            let result = storage.getClasses("Controller")
            Chai.expect(result.length).eq(0)
        })

        it("Should return class by qualified name in deep namespace", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/with-deep-namespace", "Controller")
            let result = storage.get("MyParentNamespace.MyChildNamespace.DummyController, test/metadata-loader/with-deep-namespace/dummy-controller.js")
            Chai.expect(result.name).eq("DummyController")
        })

        it("Should not return class if provided only class name on deep namespace", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/with-deep-namespace", "Controller")
            let result = storage.get("DummyController, test/metadata-loader/with-deep-namespace/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error when no classes found", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/controller", "Controller")
            let result = storage.get("OtherNonExistController, test/metadata-loader/controller/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error when no file found", () => {
            let storage = new MetaDataLoader(new DefaultIdentifierResolver())
            storage.load("test/metadata-loader/controller", "Controller")
            let result = storage.get("DummyController, not/the/correct/path")
            Chai.expect(result).undefined
        })
    })
})
