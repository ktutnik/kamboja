import * as Kecubung from "kecubung";
import * as Babylon from "babylon"
import * as Path from "path"
import * as Fs from "fs"
import * as Core from "../src/core"
import * as Sinon from "sinon"
import { RequiredValidator, RangeValidator, EmailValidator, TypeValidator, ValidatorImpl } from "../src/validator"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../src/resolver"
import { MetaDataLoader } from "../src/metadata-loader/metadata-loader"

export function fromFile(filePath: string) {
    let path = Path.join(process.cwd(), filePath)
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

export function createFacade() {
    let validators: Core.ValidatorCommand[] = [
        new RequiredValidator(),
        new RangeValidator(),
        new EmailValidator()
    ]
    let facade: Core.Facade = {
        identifierResolver: new DefaultIdentifierResolver(),
        dependencyResolver: new DefaultDependencyResolver(new DefaultIdentifierResolver()),
        metaDataStorage: new MetaDataLoader(new DefaultIdentifierResolver()),
        validators: validators
    }
    validators.push(new TypeValidator(facade.metaDataStorage))
    return facade;
}

export type Spies<T> = {
    [P in keyof T]: Sinon.SinonSpy
}

export type Stubs<T> = {
    [P in keyof T]: Sinon.SinonStub
}

export function spy<T>(object: T) {
    let spies: Spies<T> = <any>{}
    for (let key in object) {
        spies[key] = Sinon.spy(object, key)
    }
    return spies;
}

export function stub<T>(object: T) {
    let spies: Stubs<T> = <any>{}
    for (let key in object) {
        spies[key] = Sinon.stub(object, key)
    }
    return spies;
}

export function restore<T>(object: Spies<T> | Stubs<T>) {
    for (let key in object) {
        object[key].restore()
    }
}