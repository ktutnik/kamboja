

export interface HttpRequest{
    header:{[key:string]:string}
    cookie:{[key:string]:string}
    getHeader(key:string):string;
    getCookie(key:string):string
}