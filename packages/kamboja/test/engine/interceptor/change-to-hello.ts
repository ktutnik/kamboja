import { Controller } from "../../../src/controller"
import { val, Core } from "../../../src"
import { id } from "./interceptor-identifier"

@id("ChangeToHello")
export class ChangeToHello implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
        return "Hello world!"
    }
}