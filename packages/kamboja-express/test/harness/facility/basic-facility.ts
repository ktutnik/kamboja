import {Core} from "../../../src"

export class BasicFacility implements Core.Facility{
    apply(app:Core.Application){
        app.set("skipAnalysis", true);
        app.set("showLog", "None");
    }
}