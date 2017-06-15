import * as Chai from "chai"
import {reflect} from "../src/index"


let Es5Class = (() => {
    function Es5Class(){}
    Es5Class.prototype.myMethod = () => {
        console.log("Hello");
    }
    return Es5Class
})()

class Es6Class {
    myProperty
    myMethod(){
        console.log("Hello")
    }
}

describe("reflect", () => {
    it("Should reflect ES5 methods and properties", () => {
        let obj = new Es5Class()
        obj.myProperty = "Hello"
        let props = reflect(obj)
        Chai.expect(props.some(x => x == "myProperty")).true
        Chai.expect(props.some(x => x == "myMethod")).true
        Chai.expect(props.length).eq(2)
    })

    it("Should reflect object properly", () => {
        let obj = {
            myProperty: "Hello",
            myMethod: () => {}
        }
        for(let i in obj){
            console.log(i)
        }
        let props = reflect(obj)
        Chai.expect(props.some(x => x == "myProperty")).true
        Chai.expect(props.some(x => x == "myMethod")).true
    })

    it("Should reflect ES6 class properly", () => {
        let obj = new Es6Class();
        obj.myProperty = "Hello"
        let props = reflect(obj)
        Chai.expect(props.some(x => x == "myProperty")).true
        Chai.expect(props.some(x => x == "myMethod")).true
        Chai.expect(props.length).eq(2)
    })
})