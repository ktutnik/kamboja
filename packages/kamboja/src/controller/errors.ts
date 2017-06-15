import * as Tslib from "tslib"

export class HttpStatusError extends Error {
    constructor(public status:number, message?:string){
        super(message)
    }
}

/*
export class HttpStatusError {
    constructor(public status:number, public message?:string){
        var err = Error.call(this, message);
        err.status = status;
        Object.setPrototypeOf(err, HttpStatusError.prototype);
        return err;     
    }
}
Tslib.__extends(HttpStatusError, Error)

*/

