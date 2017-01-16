
export type HttpMethodType = "GET" | "POST" | "PUT" | "DELETE"

export interface HttpMethodMetaData{
    method:HttpMethodType,
    route:string;
}

export class HttpMethod {
    static ID = "kamboja:HttpMethod";

    private static method(route: string, method: HttpMethodType) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            Reflect.defineMetadata(HttpMethod.ID, {method: method, route:route}, target, propertyKey)
        };
    }
    
    static delete(url: string) {
        return HttpMethod.method(url, "DELETE");
    }

    static post(route: string) {
        return HttpMethod.method(route, "POST")
    }

    static get(route: string) {
        return HttpMethod.method(route, "GET");
    }

    static put(route: string) {
        return HttpMethod.method(route, "PUT");
    }

    static getMetaData(target, methodName){
        return <HttpMethodMetaData>Reflect.getMetadata(HttpMethod.ID, target, methodName);
    }
}