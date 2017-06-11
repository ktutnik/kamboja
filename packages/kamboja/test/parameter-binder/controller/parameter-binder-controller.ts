import { Controller, ApiController } from "../../../src/controller"
import { val, bind } from "../../../src"

export class DummyApi extends ApiController {
    myMethod(par1, par2) {
    }
    noParam() { }

    list(offset, pageWidth) { }
    modify(id, body) { }
    add(body) { }

    //value converter
    defaultConversion(par){

    }

    decoratedConversion(@val.type("string") str, @val.type("number") num, @val.type("boolean") bool){}
    conventionConversion(sName, iAge, bIsDirty, sname, iage, bisdirty){}
    arrayDecorated(@val.type("string[]") str, @val.type("number[]") num, @val.type("boolean[]") bool){}
    priority(@val.type("number") strName){}

    decoratorBinder(@bind.body() body, @bind.cookie() cookies, @bind.cookie("age") age){}
}