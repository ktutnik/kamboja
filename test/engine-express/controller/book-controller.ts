import * as Core from "../../../src/core"

export class BookController extends Core.Controller {

    index(){
        return this.view({name: "Sukreni Gadis Bali"});
    }

    redirected(){
        return this.redirect("/book/books");
    }

    books(){
        return this.view(null, "other");
    }
    
}