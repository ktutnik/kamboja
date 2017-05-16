import * as Tslib from "tslib"

export class HttpStatusError {
    constructor(public status:number, public message?:string){
        var err = Error.call(this, message);
        err.status = status;
        Object.setPrototypeOf(err, HttpStatusError.prototype);
        return err;     
    }
}
Tslib.__extends(HttpStatusError, Error)