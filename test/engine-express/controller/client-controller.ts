import * as Core from "../../../src/core"
import * as Sinon from "sinon"

export class ClientController extends Core.ApiController {

    error(){
        throw Error("This is error");
    }

    getByPage(offset, pageWidth) {
        //asynchronous result return Promise
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                resolve("BRAVO!")
            })
        }); 
    }

    get(id) {
        //synchronous result
        return "ALOHA!";
    }

}