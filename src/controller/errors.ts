
export class HttpStatusError {
    stack:string
    constructor(public status:number, public message?:string){
        this.stack = new Error().stack
    }
}