import { val } from "kamboja"
import { mongoose } from "../../../src"

export class WithoutProperties{
    name:string
}

export class ByConvention {
    @val.type("date")
    createdAt: Date
    @val.type("date")
    updatedAt: Date
}

export class ByDecorator {
    @mongoose.timestamp("createdAt")
    @val.type("date")
    createdOn: Date
    @mongoose.timestamp("updatedAt")
    @val.type("date")
    updatedOn: Date
}

export class OnlyCreatedOn{
    @val.type("date")
    createdAt: Date    
}

export class OnlyUpdatedOn {
    @val.type("date")
    updatedAt: Date    
}

export class DuplicateDecoratorCreatedOn{
    @mongoose.timestamp("createdAt")
    createdOn:Date
    @mongoose.timestamp("createdAt")
    createTime:Date
}

export class DuplicateCreatedOn{
    @mongoose.timestamp("createdAt")
    @val.type("date")
    createdOn:Date
    @val.type("date")
    createdAt:Date
}

export class DuplicateDecoratorUpdatedOn{
    @mongoose.timestamp("updatedAt")
    updatedOn:Date
    @mongoose.timestamp("updatedAt")
    updateTime:Date
}

export class DuplicateUpdatedOn{
    @mongoose.timestamp("updatedAt")
    @val.type("date")
    updatedOn:Date
    @val.type("date")
    updatedAt:Date
}