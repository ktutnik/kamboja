import { InterceptorBuilder } from "../../src/request-handler/interceptor-builder"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { DummyApi } from "./controller/controller-intercepted"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Core from "../../src/core"

describe.only("InterceptorBuilder", () => {
    let facade: Core.Facade;

    beforeEach(() => {
        facade = {
            identifierResolver: new DefaultIdentifierResolver(),
            dependencyResolver: new DefaultDependencyResolver(new DefaultIdentifierResolver()),
            metaDataStorage: new MetaDataLoader(new DefaultIdentifierResolver()),
        }
    })

    it("Should provide interceptors properly", () => {
        let meta = H.fromFile("test/request-handler/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [];
        facade.interceptors.push("DefaultInterceptor, test/request-handler/interceptor/default-interceptor")
        let executor = new InterceptorBuilder(new DummyApi(), facade, info)
        let result = executor.getInterceptors()
        Chai.expect(result.length).eq(3)
    })

})