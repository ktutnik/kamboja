import * as Core from "../../../src/core"

export class ConventionController extends Core.ApiController {

    getByPage(page, offset){
        return page + offset;
    }

    get(id){
        return id;
    }

    add(data){
        return data;
    }

    modify(id, data){
        return data;
    }

    delete(id){
        return id;
    }
}