import {Controller, ApiController} from "../../../src/controller"

export class DummyApi extends ApiController{
    returnTheParam(par1){
        return par1;
    }

    returnTheParamWithPromise(par1){
        return Promise.resolve(par1);
    }

    voidMethod(){ }

    internalError(){
        throw new Error("Internal error from DummyApi")
    }

    returnOk(){
        return this.ok("OK!")
    }
}