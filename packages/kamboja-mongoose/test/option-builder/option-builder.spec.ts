import * as Chai from "chai"
import { OptionBuilder } from "../../src/option-builder"
import * as H from "../helper"
import * as Mongoose from "mongoose"
import { Resolver } from "kamboja"

describe("OptionBuilder", () => {
    it("Should generate option with naming convention", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "ByConvention")[0]
        let test = new OptionBuilder()
        let result = test.getOption(clazz)
        Chai.expect((<any>result.timestamps).createdAt).eq("createdAt")
        Chai.expect((<any>result.timestamps).updatedAt).eq("updatedAt")
    })

    it("Should generate option with decorator", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "ByDecorator")[0]
        let test = new OptionBuilder()
        let result = test.getOption(clazz)
        Chai.expect((<any>result.timestamps).createdAt).eq("createdOn")
        Chai.expect((<any>result.timestamps).updatedAt).eq("updatedOn")
    })

    it("Should not error when only createdAt", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "OnlyCreatedOn")[0]
        let test = new OptionBuilder()
        let result = test.getOption(clazz)
        Chai.expect((<any>result.timestamps).createdAt).eq("createdAt")
    })

    it("Should not error when only updatedAt", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "OnlyUpdatedOn")[0]
        let test = new OptionBuilder()
        let result = test.getOption(clazz)
        Chai.expect((<any>result.timestamps).updatedAt).eq("updatedAt")
    })

    it("Should throw error when duplicate decorator", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "DuplicateDecoratorCreatedOn")[0]
        let test = new OptionBuilder()
        Chai.expect(() => {
            let result = test.getOption(clazz)
        }).throw(`Model DuplicateDecoratorCreatedOn contains more than one @mongoose.timestamp("createdAt") decorator, only one allowed`)
    })

    it("Should throw error when duplicate decorator and convention", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "DuplicateCreatedOn")[0]
        let test = new OptionBuilder()
        Chai.expect(() => {
            let result = test.getOption(clazz)
        }).throw(`Model DuplicateCreatedOn contains more than one @mongoose.timestamp("createdAt") decorator, only one allowed`)
    })

    it("Should throw error when duplicate decorator", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "DuplicateDecoratorUpdatedOn")[0]
        let test = new OptionBuilder()
        Chai.expect(() => {
            let result = test.getOption(clazz)
        }).throw(`Model DuplicateDecoratorUpdatedOn contains more than one @mongoose.timestamp("updatedAt") decorator, only one allowed`)
    })

    it("Should throw error when duplicate decorator and convention", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "DuplicateUpdatedOn")[0]
        let test = new OptionBuilder()
        Chai.expect(() => {
            let result = test.getOption(clazz)
        }).throw(`Model DuplicateUpdatedOn contains more than one @mongoose.timestamp("updatedAt") decorator, only one allowed`)
    })

    it("Should not error when no properties match found", () => {
        let classes = H.fromFile("model/models.js", new Resolver.DefaultPathResolver(__dirname))
        let clazz = classes.filter(x => x.name == "WithoutProperties")[0]
        let test = new OptionBuilder()
        let result = test.getOption(clazz)
        Chai.expect(result).undefined
    })
})