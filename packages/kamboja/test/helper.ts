import * as Kecubung from "kecubung";
import * as Babylon from "babylon"
import * as Fs from "fs"
import {Core, Test} from "../src"
import * as Transformer from "../src/route-generator/transformers"
import { DefaultDependencyResolver, DefaultIdentifierResolver, DefaultPathResolver } from "../src/resolver"
import { MetaDataLoader } from "../src/metadata-loader/metadata-loader"
import * as Sinon from "sinon"

export function fromFile(filePath: string, pathResolver: Core.PathResolver) {
    let path = pathResolver.resolve(filePath)
    let code = Fs.readFileSync(path).toString()
    return fromCode(code, filePath)
}

export function fromCode(code, filePath: string = "") {
    let ast = Babylon.parse(code);
    return Kecubung.transform("ASTree", ast, filePath);
}

export function cleanUp(info: Core.RouteInfo[]) {
    return info.map(x => {
        let result: any = {
            initiator: x.initiator,
            route: x.route,
            httpMethod: x.httpMethod,
            methodMetaData: {
                name: x.methodMetaData ? x.methodMetaData.name : ""
            },
            //windows hack
            qualifiedClassName: x.qualifiedClassName.replace(/\\/g, "/"),
            classMetaData: {
                name: x.classMetaData.name
            },
            collaborator: x.collaborator,
        }
        if (x.analysis) result.analysis = x.analysis
        if (x.classMetaData.baseClass) result.classMetaData.baseClass = x.classMetaData.baseClass
        return result;
    });
}

export function errorReadFile(path: string): Buffer {
    throw new Error("Error: ENOENT: no such file or directory, open")
}

export function createFacade(rootPath: string) {
    let pathResolver = new DefaultPathResolver(rootPath);
    let facade: Core.Facade = {
        identifierResolver: new DefaultIdentifierResolver(),
        dependencyResolver: new DefaultDependencyResolver(new DefaultIdentifierResolver(), pathResolver),
        metaDataStorage: new MetaDataLoader(new DefaultIdentifierResolver(), pathResolver),
        pathResolver: pathResolver,
        autoValidation: true
    }
    return facade;
}

export function getRouteInfo(facade: Core.Facade, path: string, methodName: string) {
    let meta = fromFile(path, facade.pathResolver)
    let infos = Transformer.transform(meta)
    let info = infos.filter(x => x.methodMetaData.name == methodName)[0]
    info.classId = info.qualifiedClassName
    return info
}


export function spy<T>(obj:T) {
    return Test.mock(obj, Sinon.spy);
}

export function stub<T>(obj:T) {
    return Test.mock(obj, Sinon.stub)
}