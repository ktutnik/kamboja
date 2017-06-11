import { ParameterBinder } from "../../src/parameter-binder"
import { DefaultDependencyResolver, DefaultPathResolver } from "../../src/resolver"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"


let HttpRequest: any = {
    body: { data: "Hello!" },
    getParam: (key: string) => { },
    cookies: { "name": "Nobita", "age": "9" },
    getCookie: (key:string) => {}
}

describe("ParameterBinder", () => {
    describe("Default", () => {
        let getParamStub: Sinon.SinonStub;
        let resSpy: Sinon.SinonSpy;

        beforeEach(() => {
            getParamStub = Sinon.stub(HttpRequest, "getParam")
        })

        afterEach(() => {
            getParamStub.restore();
        })

        it("Should bind string value properly", () => {
            //dummy/mymethod/:par1/:par2        
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getParamStub.withArgs("par1").returns("param1")
            getParamStub.withArgs("par2").returns("param2")
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "myMethod")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq(["param1", "param2"])
        })

        it("Should bind number value properly", () => {
            //dummy/mymethod/:par1/:par2        
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getParamStub.withArgs("par1").returns("20")
            getParamStub.withArgs("par2").returns("30")
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "myMethod")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([20, 30])
        })

        it("Should bind boolean value properly", () => {
            //dummy/mymethod/:par1/:par2        
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getParamStub.withArgs("par1").returns("false")
            getParamStub.withArgs("par2").returns("True")
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "myMethod")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([false, true])
        })

        it("Should return empty array for method without parameter", () => {
            //dummy/mymethod/:par1/:par2        
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getParamStub.withArgs("par1").returns("false")
            getParamStub.withArgs("par2").returns("True")
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "noParam")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([])
        })

        it("Should return empty array for method without parameter", () => {
            //dummy/mymethod/:par1/:par2        
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getParamStub.withArgs("par1").returns("false")
            getParamStub.withArgs("par2").returns("True")
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "noParam")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([])
        })

        it("Should return empty array for method without parameter", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getParamStub.withArgs("sName").returns("name")
            getParamStub.withArgs("iAge").returns("30")
            getParamStub.withArgs("bIsDirty").returns("True")
            getParamStub.withArgs("sname").returns("name")
            getParamStub.withArgs("iage").returns("30")
            getParamStub.withArgs("bisdirty").returns("True")
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "conventionConversion")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq(["name", 30, true, "name", 30, true])
        })
    })

    describe("Api Convention", () => {
        let getParamStub: Sinon.SinonStub;
        let bodyStub: Sinon.SinonSpy;

        beforeEach(() => {
            getParamStub = Sinon.stub(HttpRequest, "getParam")
        })

        afterEach(() => {
            getParamStub.restore();
        })

        it("Should fallback to default binding on GET Http Method", () => {
            //dummy?offset=1&pageWidth=10  
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getParamStub.withArgs("offset").returns(1)
            getParamStub.withArgs("pageWidth").returns(10)

            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "list")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([1, 10])
        })

        it("Should assign HttpRequest Body on first parameter on POST method", () => {
            //dummy       
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "add")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([{ data: "Hello!" }])
        })

        it("Should assign HttpRequest Body on second parameter on PUT method", () => {
            //dummy/id     
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "modify")[0], HttpRequest);
            getParamStub.withArgs("id").returns(1)
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([1, { data: "Hello!" }])
        })

    })

    describe("Decorator", () => {
        let getCookie: Sinon.SinonStub;

        beforeEach(() => {
            getCookie = Sinon.stub(HttpRequest, "getCookie")
        })

        afterEach(() => {
            getCookie.restore();
        })

        it("Should bind request body properly", () => {
            //dummy?offset=1&pageWidth=10  
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            getCookie.withArgs("age").returns(9)

            let binder = new ParameterBinder(infos.filter(x => x.methodMetaData.name == "decoratorBinder")[0], HttpRequest);
            let result = binder.getParameters();
            Chai.expect(result).deep.eq([{data: "Hello!"}, { "name": "Nobita", "age": "9" }, 9])
        })
    })
})