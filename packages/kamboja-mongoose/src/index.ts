import { MongooseDecorator } from "./mongoose-decorator"
const mongoose = new MongooseDecorator()
export { mongoose }
import { ValidatorDecorator } from "./validator/validator-decorator"
const val = new ValidatorDecorator()
export { val }
export { ObjectIdValidator } from "./validator/objectid-validator"
export { ShortIdValidator } from "./validator/shortid-validator"
export { MongooseHelper } from "./mongoose-helper"