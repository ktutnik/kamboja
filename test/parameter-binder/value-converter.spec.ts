import { convert } from "../../src/parameter-binder/value-converter"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"


describe("Value Converter", () => {
    describe("Default Value Converter", () => {
        it("Should convert string properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, "halo")
            Chai.expect(typeof result).eq("string")
        })

        it("Should convert number properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, "200")
            Chai.expect(typeof result).eq("number")
        })

        it("Should convert boolean properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, "True")
            Chai.expect(typeof result).eq("boolean")
        })

        it("Should convert undefined properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, undefined)
            Chai.expect(typeof result).eq("undefined")
        })

        it("Should convert object properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, { data: "Hello" })
            Chai.expect(result).deep.eq({ data: "Hello" })
        })
    })

    describe("Decorated Value Converter", () => {
        it("Should convert string properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, "halo")
            Chai.expect(typeof result).eq("string")
        })

        it("Should convert number properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[1]
            let result = convert(info, parameterMeta, "200")
            Chai.expect(typeof result).eq("number")
        })

        it("Should convert boolean properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[2]
            let result = convert(info, parameterMeta, "True")
            Chai.expect(typeof result).eq("boolean")
        })

        it("Should convert undefined properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, undefined)
            Chai.expect(typeof result).eq("undefined")
        })

        it("Should throw if provided object", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            Chai.expect(() => convert(info, parameterMeta, { data: "Hello" }))
                .throw("Expected parameter type of [@val.type('string') str] but got object in [DummyApi.decoratedConversion test/parameter-binder/controller/parameter-binder-controller.js]")
        })

    })

    describe("Convention Value Converter", () => {
        it("Should convert string properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, "halo")
            Chai.expect(typeof result).eq("string")
        })

        it("Should convert number properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[1]
            let result = convert(info, parameterMeta, "200")
            Chai.expect(typeof result).eq("number")
        })

        it("Should convert boolean properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[2]
            let result = convert(info, parameterMeta, "True")
            Chai.expect(typeof result).eq("boolean")
        })

        it("Should convert undefined properly", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            let result = convert(info, parameterMeta, undefined)
            Chai.expect(typeof result).eq("undefined")
        })

        it("Should throw if provided object on str<Name>", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[0]
            Chai.expect(() => convert(info, parameterMeta, { data: "Hello" }))
                .throw("Expected parameter type of \'string\'  but got object in [strName] [DummyApi.conventionConversion test/parameter-binder/controller/parameter-binder-controller.js]")
        })

        it("Should throw if provided object on num<Name>", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[1]
            Chai.expect(() => convert(info, parameterMeta, { data: "Hello" }))
                .throw("Expected parameter type of \'number\'  but got object in [intAge] [DummyApi.conventionConversion test/parameter-binder/controller/parameter-binder-controller.js")
        })

        it("Should throw if provided object on bool<Name>", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[2]
            Chai.expect(() => convert(info, parameterMeta, { data: "Hello" }))
                .throw("Expected parameter type of \'boolean\'  but got object in [boolIsDirty] [DummyApi.conventionConversion test/parameter-binder/controller/parameter-binder-controller.js]")
        })

        it("Should not convert if parameter name after 'str' is lower case", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[3]
            Chai.expect(convert(info, parameterMeta, { data: "Hello" }))
                .deep.eq({data: "Hello"})
        })

        it("Should not convert if parameter name after 'int' is lower case", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[4]
            Chai.expect(convert(info, parameterMeta, { data: "Hello" }))
                .deep.eq({data: "Hello"})
        })

        it("Should not convert if parameter name after 'bool' is lower case", () => {
            let meta = H.fromFile("test/parameter-binder/controller/parameter-binder-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData.parameters[5]
            Chai.expect(convert(info, parameterMeta, { data: "Hello" }))
                .deep.eq({data: "Hello"})
        })

    })

})