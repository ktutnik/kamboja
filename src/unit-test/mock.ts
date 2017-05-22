
export type Mock<T, TResult> = {
    [P in keyof T]: TResult
}

export interface Mockable<T, TResult>{
    MOCKS:Mock<T, TResult>
}

export function mock<T, TResult>(obj:T, sinon: (obj:any, key:string) => TResult) : (T & Mockable<T, TResult>){
    let mocks:Mock<T, TResult> = <any> {}
    for(let key in obj){
        mocks[key] = sinon(obj, key)
    }
    let result:any = obj
    result.MOCKS = mocks
    return result;
}
