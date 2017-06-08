import {HttpRequest, HttpResponse, spy, stub} from "../src"
import * as Chai from "chai";

describe("Testing Utility", () => {
    it("Should provide HttpRequest properly", () => {
        let request = new HttpRequest();
        request.getCookie("")
        request.getHeader("")
        request.getParam("")
        request.getUserRole()
        request.getAccepts("")
        request.isAuthenticated()
    })

    it("Should provide HttpResponse properly", () => {
        let response = new HttpResponse();
        response.send()
    })

    it("Should provide stub properly", () => {
        let resp = stub(new HttpResponse());
        resp.send();
        Chai.expect(resp.MOCKS.send.called).true
    })

    it("Should provide spy properly", () => {
        let resp = spy(new HttpResponse());
        resp.send();
        Chai.expect(resp.MOCKS.send.called).true
    })
})
