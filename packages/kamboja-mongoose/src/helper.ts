
export function getName(name:string){
    if(name.toLowerCase().indexOf("model", name.length - 5) > -1){
        return name.substr(0, name.length - 5)
    }
    else return name;
}