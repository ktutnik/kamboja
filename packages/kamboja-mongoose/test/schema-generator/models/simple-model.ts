import { val } from "kamboja"

export class ReferenceEntityWithArray {
    @val.type("SimpleEntity[], models/simple-model")
    children: SimpleEntity[]
}

export class ReferenceEntity {
    @val.type("SimpleEntity, models/simple-model")
    children: SimpleEntity
}

export class SimpleEntity {
    @val.type("string")
    name: string
    @val.type("number")
    id: number
    @val.type("date")
    createdOn:Date
    @val.type("boolean")
    running:boolean
}

export class EntityWithArray{
    @val.type("string[]")
    name: string[]
    @val.type("number[]")
    id: number[]
    @val.type("date[]")
    createdOn:Date[]
    @val.type("boolean[]")
    running:boolean[]
}

export class EntityWithoutDecorator{
    age:number
    name:string
}

export class EntityMultipleDecorated{
    @val.type("number")
    @val.type("string")
    age:number
}

export class EntityWithUnsupportedType{
    @val.type("integer")
    age:number
}
