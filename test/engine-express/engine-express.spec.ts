import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Supertest from "supertest"
import { ExpressEngine } from "../../src/engine-express"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { RouteGenerator } from "../../src/route-generator"
import * as http from "http"
import * as Fs from "fs"

async function setupApp() {
    let router = new RouteGenerator(["test/engine-express/controller"],
         new DefaultIdentifierResolver(), Fs.readFile)
    let engine = new ExpressEngine(new DefaultDependencyResolver(),
        {
            staticFilePath: "test/engine-express/public",
            viewEngine: "pug",
            viewPath: "test/engine-express/view",
        })
    let routes = await router.getRoutes();
    return engine.init(routes.result);
}

describe("ExpressEngine", () => {
    describe("API Controller", () => {
        let app;
        beforeEach(async () => {
            app = await setupApp()
        })

        it("Should return data with promise", async () => {
            return Supertest(app)
                .get("/client/page/10/10")
                .expect((res) => {
                    Chai.expect(res.body).eq("BRAVO!")
                })
                .expect(200)
        })

        it("Should return data without promise", async () => {
            return Supertest(app)
                .get("/client/10")
                .expect((res) => {
                    Chai.expect(res.body).eq("ALOHA!")
                })
                .expect(200)
        })

        it("Should return status 500 on thrown error", async () => {
            return Supertest(app)
                .get("/client/error")
                .expect((res) => {
                    console.log(res.body)
                })
                .expect(500)
        })
    })

    describe("Controller", () => {
        let app;
        beforeEach(async () => {
            app = await setupApp()
        })
        it("Should return view properly", async () => {
            return Supertest(app)
                .get("/book")
                .expect(200)
        })

        it("Should return redirect properly", async () => {
            return Supertest(app)
                .get("/book/redirected")
                .redirects(1)
                .expect(200)
        })
    })

})