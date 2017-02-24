import "reflect-metadata"

function save(){
    return (target)=> {
        Reflect.defineMetadata("KEY", "HELLO", target)
    }
}

function getSave(target){
    return Reflect.getMetadata("KEY", target)
}

@save()
class MyClass{

}


let clas = new MyClass();
let result = getSave(clas.constructor);

console.log(result)