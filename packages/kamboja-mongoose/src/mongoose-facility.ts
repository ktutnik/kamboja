import { Core } from "kamboja"
import { ObjectIdValidator } from "./validator/objectid-validator"
import { ShortIdValidator } from "./validator/shortid-validator"

export class MongooseFacility implements Core.Facility {
    apply(app: Core.Application) {
        let validators = <any[]>app.get("validators")
        validators.push(new ObjectIdValidator())
        validators.push(new ShortIdValidator())
        app.set("validators", validators)
    }
}