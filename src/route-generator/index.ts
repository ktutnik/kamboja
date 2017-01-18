import * as Core from "../core"
import * as MethodVisitor from "./method-visitors"
import { MetaData, AnalysisType } from "kenanga"
import { ControllerStriperVisitor, ModuleOrClassVisitor  } from "./class-visitors"

export class RouteGenerator implements Core.Generator {
    private classVisitors: Array<Core.ClassVisitor> = []
    private methodVisitors: Array<Core.MethodVisitor> = []
    fileName: string;

    constructor(private meta: MetaData, option?: Core.GeneratorOption) {
        let opt = this.getOption(option);
        this.fileName = meta.name;
        if (opt.stripeController)
            this.classVisitors.push(new ControllerStriperVisitor(this))
        this.classVisitors.push(new ModuleOrClassVisitor(this))
        //visitor order, the most important put it at the top
        if (opt.internalDecorator)
            this.methodVisitors.push(new MethodVisitor.MethodWithInternalDecoratorVisitor(this))
        if (opt.httMethodDecorator)
            this.methodVisitors.push(new MethodVisitor.MethodWithHttpDecoratorVisitor(this))
        if (opt.apiConvention)
            this.methodVisitors.push(new MethodVisitor.ConventionOverConfigurationMethodVisitor(this))
        this.methodVisitors.push(new MethodVisitor.DefaultMethodVisitor(this))
    }

    private getOption(opt: Core.GeneratorOption): Core.GeneratorOption {
        let defaultOpt: Core.GeneratorOption = {
            stripeController: true,
            internalDecorator: true,
            httMethodDecorator: true,
            apiConvention: false
        }
        for (let key in opt) {
            defaultOpt[key] = opt[key]
        }
        return defaultOpt;
    }


    traverseArray(children: MetaData[], parent: string) {
        let result: Core.RouteInfo[] = [];
        for (let child of children) {
            let traverseResult = this.traverseMeta(child, parent)
            if (traverseResult && traverseResult.length > 0)
                result = result.concat(traverseResult)
        }
        return result;
    }

    traverseMeta(meta: MetaData, parent: string) {
        if ((meta.analysis & AnalysisType.Valid) != AnalysisType.Valid)
            return null;

        switch (meta.type) {
            case "Class":
            case "Module":
                return this.classVisitorAggregate(meta, parent);
            case "Method":
                return this.methodVisitorAggregate(meta, parent);
            default:
                return this.traverseArray(meta.children, parent);
        }
    }

    private classVisitorAggregate(meta: MetaData, parent: string) {
        for (let visitor of this.classVisitors) {
            let result = visitor.visit(meta, parent)
            if (result) return result;
        }
    }

    private methodVisitorAggregate(meta: MetaData, parent: string) {
        let analysis: Core.RouteAnalysis[] = []
        for (let visitor of this.methodVisitors) {
            let result = visitor.visit(meta, parent)
            switch (result.status) {
                case "Complete":
                    result.result.analysis = analysis.concat(result.result.analysis)
                    return [result.result];
                case "NextWithAnalysis":
                    analysis = analysis.concat(result.result.analysis)
                    break;
                case "Exit":
                    return null;
            }
        }
    }

    getRoutes() {
        return this.traverseMeta(this.meta, "")
    }
}
