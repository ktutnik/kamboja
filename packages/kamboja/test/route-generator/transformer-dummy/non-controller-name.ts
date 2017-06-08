import { internal, http } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class ControllerWithoutPrefix extends Controller {
    myGetAction(par1) { }
}