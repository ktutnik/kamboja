import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Supertest from "supertest"
import {Kamboja} from "../../src/kamboja"
import * as http from "http"


describe("Kamboja", () => {
    describe.only("API Controller", () => {
        let app;

        beforeEach(async () => {
            let kamboja = new Kamboja({
                controllerPaths:["test/kamboja/api", "test/kamboja/controller"]
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
                .write("ALOHA!")
                .expect((res) => {
                    Chai.expect(res.body).eq("ALOHA!")
                })
                .expect(200)
        })

        it("Should return modify properly", async () => {
            return Supertest(app)
                .put("/convention/2")
                .write("ALOHA!")
                .expect((res) => {
                    Chai.expect(res.body).eq("ALOHA!")
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

    describe.only("Controller", () => {
        
    })

})