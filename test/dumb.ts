export module ParentModule.ChildModule{
    export class MyClass{
        myMethod(par1, par2){}
        myMethodWoParams(){}
    }

    class NonExportedClass{
        myMethod(par1, par2){}        
    }
}