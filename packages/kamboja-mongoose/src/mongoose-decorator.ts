

export class MongooseDecorator{
    timestamp(type:"createdAt"|"updatedAt"){
        return (...args) => {}
    }

    shortid(){
        return (constructor) => {}
    }
}