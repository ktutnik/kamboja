import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Supertest from "supertest"
import { Kamboja } from "../../src/kamboja"
import * as http from "http"



describe("Kamboja", () => {
    describe("API Convention", () => {
        let app;

        beforeEach(async () => {
            let kamboja = new Kamboja({
                controllerPaths: ["test/kamboja/api", "test/kamboja/controller"]
            })
            app = await kamboja.setup();
        })

        it("Should return getByPage properly", async () => {
            return Supertest(app)
                .get("/convention/page/10/10")
                .expect((res) => {
                    Chai.expect(res.body).eq(20)
                })
                .expect(200)
        })

        it("Should return get properly", async () => {
            return Supertest(app)
                .get("/convention/10")
                .expect((res) => {
                    Chai.expect(res.body).eq(10)
                })
                .expect(200)
        })

        it("Should return add properly", async () => {
            return Supertest(app)
                .post("/convention")
                .send({ a: 100, b: 200 })
                .expect((res) => {
                    Chai.expect(res.body).deep
                        .eq({ a: 100, b: 200 })
                })
                .expect(200)
        })

        it("Should return modify properly", async () => {
            return Supertest(app)
                .put("/convention/2")
                .send({ data: "ALOHA!" })
                .expect((res) => {
                    Chai.expect(res.body).deep
                        .eq({ data: "ALOHA!" })
                })
                .expect(200)
        })

        it("Should return delete properly", async () => {
            return Supertest(app)
                .delete("/convention/2")
                .expect((res) => {
                    Chai.expect(res.body).eq(2)
                })
                .expect(200)
        })
    })

    describe("Http Decorator", () => {
        let app;

        beforeEach(async () => {
            let kamboja = new Kamboja({
                controllerPaths: ["test/kamboja/api", "test/kamboja/controller"]
            })
            app = await kamboja.setup();
        })

        it("Should return GET properly", async () => {
            return Supertest(app)
                .get("/this/is/get")
                .expect((res) => {
                    Chai.expect(res.body).deep.eq({ data: "Hello" })
                })
                .expect(200)
        })

        it("Should return POST properly", async () => {
            return Supertest(app)
                .post("/this/is/post")
                .expect((res) => {
                    Chai.expect(res.body).deep.eq({ data: "Hello" })
                })
                .expect(200)
        })

        it("Should return PUT properly", async () => {
            return Supertest(app)
                .put("/this/is/put")
                .expect((res) => {
                    Chai.expect(res.body).deep.eq({ data: "Hello" })
                })
                .expect(200)
        })

        it("Should return DELETE properly", async () => {
            return Supertest(app)
                .del("/this/is/delete")
                .expect((res) => {
                    Chai.expect(res.body).deep.eq({ data: "Hello" })
                })
                .expect(200)
        })
    })

    describe("Multiple Decorators", () => {
        let app;

        beforeEach(async () => {
            let kamboja = new Kamboja({
                controllerPaths: ["test/kamboja/api", "test/kamboja/controller"]
            })
            app = await kamboja.setup();
        })

        it("/multiple should return from the same method", async () => {
            return Supertest(app)
                .get("/multiple")
                .expect((res) => {
                    Chai.expect(res.body).deep.eq({ data: "Hello" })
                })
                .expect(200)
        })

        it("/multiple/home should return from the same method", async () => {
            return Supertest(app)
                .get("/multiple/home")
                .expect((res) => {
                    Chai.expect(res.body).deep.eq({ data: "Hello" })
                })
                .expect(200)
        })
    })

    describe("Controller with issue", () => {
        let kamboja:Kamboja;

        beforeEach(async () => {
            kamboja = new Kamboja({
                exitOnError: false,
                controllerPaths: ["test/kamboja/issue-controller"]
            })
        })

        it("Should identify non exported controller", async () => {
            await kamboja.setup()
            console.log(kamboja.getRoutes())
        })

        it("Should identify controller not inherited from controller", async () => {
            
        })
    })

})