import * as Chai from "chai"
import { SchemaGenerator } from "../../src/schema-generator"
import { TypeConverter } from "../../src/type-converter"
import * as H from "../helper"
import * as Mongoose from "mongoose"
import { Resolver } from "kamboja"

describe("SchemaGenerator", () => {
    let test: SchemaGenerator
    beforeEach(() => {

    })
    it("Should generate simple object", () => {
        let classes = H.fromFile("models/simple-model.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "SimpleEntity")[0]
        let resolver = new Resolver.DefaultPathResolver(__dirname);
        let converter = new TypeConverter(resolver, classes)
        let test = new SchemaGenerator(resolver, converter)
        let result = test.generate(clazz)
        Chai.expect(result).deep.eq({
            name: String,
            id: Number,
            createdOn: Date,
            running: Boolean
        })
    })

    it("Should generate object with array", () => {
        let classes = H.fromFile("models/simple-model.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "EntityWithArray")[0]
        let resolver = new Resolver.DefaultPathResolver(__dirname);
        let converter = new TypeConverter(resolver, classes)
        let test = new SchemaGenerator(resolver, converter)
        let result = test.generate(clazz)
        Chai.expect(result).deep.eq({
            name: [String],
            id: [Number],
            createdOn: [Date],
            running: [Boolean]
        })
    })

    it("Should generate object with reference to other object", () => {
        let classes = H.fromFile("models/simple-model.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "ReferenceEntity")[0]
        let resolver = new Resolver.DefaultPathResolver(__dirname);
        let converter = new TypeConverter(resolver, classes)
        let test = new SchemaGenerator(resolver, converter)
        let result = test.generate(clazz)
        Chai.expect(result).deep.eq({
            children: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "SimpleEntity"
            }
        })
    })

    it("Should generate object with array reference to other object", () => {
        let classes = H.fromFile("models/simple-model.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "ReferenceEntityWithArray")[0]
        let resolver = new Resolver.DefaultPathResolver(__dirname);
        let converter = new TypeConverter(resolver, classes)
        let test = new SchemaGenerator(resolver, converter)
        let result = test.generate(clazz)
        Chai.expect(result).deep.eq({
            children: [{
                type: Mongoose.Schema.Types.ObjectId,
                ref: "SimpleEntity"
            }]
        })
    })

    it("Should return undefined if no decorated property", () => {
        let classes = H.fromFile("models/simple-model.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "EntityWithoutDecorator")[0]
        let resolver = new Resolver.DefaultPathResolver(__dirname);
        let converter = new TypeConverter(resolver, classes)
        let test = new SchemaGenerator(resolver, converter)
        let result = test.generate(clazz)
        Chai.expect(result).undefined
    })

    it("Should throw if multiple decorator found", () => {
        let classes = H.fromFile("models/simple-model.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "EntityMultipleDecorated")[0]
        let resolver = new Resolver.DefaultPathResolver(__dirname);
        let converter = new TypeConverter(resolver, classes)
        let test = new SchemaGenerator(resolver, converter)
        Chai.expect(() => {
            test.generate(clazz)
        }).throw("Multiple @val.type found in [EntityMultipleDecorated]")
    })

    it("Should throw unsupported type found", () => {
        let classes = H.fromFile("models/simple-model.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "EntityWithUnsupportedType")[0]
        let resolver = new Resolver.DefaultPathResolver(__dirname);
        let converter = new TypeConverter(resolver, classes)
        let test = new SchemaGenerator(resolver, converter)
        Chai.expect(() => {
            test.generate(clazz)
        }).throw("Invalid type used in @val.type in [EntityWithUnsupportedType]")
    })
})