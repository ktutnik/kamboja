
import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { TransformerBase, getWhen, when } from "../../../src/route-generator/transformers/transformer-base"

class MyCustomClassTransformer extends TransformerBase {
    constructor(trans: TransformerBase[]) {
        super()
        this.transformers = trans
    }
    @when("Class")
    transform(meta: Kecubung.ClassMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        let children = this.transformChildren(meta.methods, "/parent")
        return this.exit(children)
    }
}

class ExitWithResultTransformer extends TransformerBase {
    @when("Method")
    transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        return this.exit(<Core.RouteInfo>{ route: "/exit/with/result", })
    }
}

class NextWithResultTransformer extends TransformerBase {
    @when("Method")
    transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        return this.next(<Core.RouteInfo>{ route: "/next/with/result" })
    }
}

class ExitTransformer extends TransformerBase {
    @when("Method")
    transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        return this.exit()
    }
}

class MergeWithPreviousResultTransformer extends TransformerBase {
    @when("Method")
    transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        if(!prevResult) prevResult = [{route: ""}]
        return this.exit(<Core.RouteInfo>{ route: prevResult[0].route + "/merged/with/last" })
    }
}

class NextTransformer extends TransformerBase {
    @when("Method")
    transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        return this.next()
    }
}

describe("TransformerBase", () => {
    describe("Decorators", () => {
        it("Should decorate transformer properly", () => {
            let test = new MyCustomClassTransformer(null)
            Chai.expect(getWhen(test, "transform")).eq("Class")
        })
    })

    it("Should prioritize first children", () => {
        let test = new MyCustomClassTransformer([
            new ExitTransformer(),
            new NextWithResultTransformer()
        ])
        let result = test.transform(<Kecubung.ClassMetaData>{ methods: [{ type: "Method" }] }, "", undefined)
        Chai.expect(result.info[0]).undefined
    })

    it("Should be able to pass result to next children", () => {
        let test = new MyCustomClassTransformer([
            new NextWithResultTransformer(),
            new MergeWithPreviousResultTransformer(),
        ])
        let result = test.transform(<Kecubung.ClassMetaData>{ methods: [{ type: "Method" }] }, "", undefined)
        Chai.expect(result.info[0].route).eq("/next/with/result/merged/with/last")
    })

    it("Should be able to pass result to next children", () => {
        let test = new MyCustomClassTransformer([
            new NextTransformer(),
            new MergeWithPreviousResultTransformer(),
        ])
        let result = test.transform(<Kecubung.ClassMetaData>{ methods: [{ type: "Method" }] }, "", undefined)
        Chai.expect(result.info[0].route).eq("/merged/with/last")
    })
})