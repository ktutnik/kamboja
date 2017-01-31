import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class ControllerWithoutPrefix extends Controller {
    myGetAction(par1) { }
}