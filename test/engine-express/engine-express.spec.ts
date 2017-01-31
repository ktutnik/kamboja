import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Supertest from "supertest"
import { ExpressEngine } from "../../src/engine-express"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { RouteGenerator } from "../../src/route-generator"
import * as http from "http"

describe("ExpressEngine", () => {
    describe("API Controller", () => {
        it("Should return data with promise", async () => {
            let router = new RouteGenerator(["test/engine-express/controller"], new DefaultIdentifierResolver())
            let engine = new ExpressEngine(new DefaultDependencyResolver(),
                {
                    staticFilePath: "test/engine-express/public",
                    viewEngine: "jade",
                    viewPath: "test/engine-express/public",
                })
            let routes = await router.getRoutes();
            let app = engine.init(routes.result);

            return Supertest(app)
                .get("/client/page/10/10")
                .expect((res) => {
                    Chai.expect(res.body).eq("BRAVO!")
                })
                .expect(200)
        })

        it("Should return data without promise", async () => {
            let router = new RouteGenerator(["test/engine-express/controller"], new DefaultIdentifierResolver())
            let engine = new ExpressEngine(new DefaultDependencyResolver(),
                {
                    staticFilePath: "test/engine-express/public",
                    viewEngine: "jade",
                    viewPath: "test/engine-express/public",
                })
            let routes = await router.getRoutes();
            let app = engine.init(routes.result);

            return Supertest(app)
                .get("/client/10")
                .expect((res) => {
                    Chai.expect(res.body).eq("ALOHA!")
                })
                .expect(200)
        })

        it("Should return status 500 on thrown error", async () => {
            let router = new RouteGenerator(["test/engine-express/controller"], new DefaultIdentifierResolver())
            let engine = new ExpressEngine(new DefaultDependencyResolver(),
                {
                    staticFilePath: "test/engine-express/public",
                    viewEngine: "jade",
                    viewPath: "test/engine-express/public",
                })
            let routes = await router.getRoutes();
            let app = engine.init(routes.result);

            return Supertest(app)
                .get("/client/error")
                .expect((res) => {
                    console.log(res.body)
                })
                .expect(500)
        })
    })

})