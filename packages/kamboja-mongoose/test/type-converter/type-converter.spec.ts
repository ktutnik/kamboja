import * as Chai from "chai"
import { TypeConverter } from "../../src/type-converter"
import * as Mongoose from "mongoose"
import {Resolver} from "kamboja"
import * as H from "../helper"

describe("TypeConverter", () => {
    it("Should convert 'string'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("string", "Type, the/path")).eq(String)
    })

    it("Should convert 'boolean'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("boolean", "Type, the/path")).eq(Boolean)
    })

    it("Should convert 'number'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("number", "Type, the/path")).eq(Number)
    })

    it("Should convert 'date'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("date", "Type, the/path")).eq(Date)
    })

    it("Should convert 'string[]'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("string[]", "Type, the/path")).deep.eq([String])
    })

    it("Should convert 'boolean[]'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("boolean[]", "Type, the/path")).deep.eq([Boolean])
    })

    it("Should convert 'number[]'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("number[]", "Type, the/path")).deep.eq([Number])
    })

    it("Should convert 'date[]'", () => {
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), null)
        Chai.expect(test.convert("date[]", "Type, the/path")).deep.eq([Date])
    })

    it("Should provide qualified class name", () => {
        let classes = H.fromFile("models/models.js", new Resolver.DefaultPathResolver(__dirname))
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), classes)
        Chai.expect(test.convert("DefaultIdModel, models/models", "Type, the/path")).deep.eq({
            type: Mongoose.Schema.Types.ObjectId,
            ref: "DefaultId"
        })
    })

    it("Should throw if provided model doesn't exists", () => {
        let classes = H.fromFile("models/models.js", new Resolver.DefaultPathResolver(__dirname))
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), classes)
        Chai.expect(() =>
            test.convert("ModelWhichIsNotExists, models/models", "Type, the/path"))
            .throw("Model [ModelWhichIsNotExists, models/models] used in @val.type is not exists in [Type, the/path]")
    })

    it("Should provide qualified class name array", () => {
        let classes = H.fromFile("models/models.js", new Resolver.DefaultPathResolver(__dirname))
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), classes)
        Chai.expect(test.convert("DefaultIdModel[], models/models", "Type, the/path")).deep.eq([{
            type: Mongoose.Schema.Types.ObjectId,
            ref: "DefaultId"
        }])
    })

    it("Should provide qualified class name with shortid", () => {
        let classes = H.fromFile("models/models.js", new Resolver.DefaultPathResolver(__dirname))
        let test = new TypeConverter(new Resolver.DefaultPathResolver(__dirname), classes)
        Chai.expect(test.convert("ShortModel, models/models", "Type, the/path")).deep.eq({
            type: String,
            ref: "Short"
        })
    })
})