import { ApiController, val } from "../../../src"

export class DummyApi extends ApiController {
    get(id) {
        return id
    }

    list(iOffset, iLimit) {
        return {
            iOffset:iOffset,
            iLimit:iLimit
        }
    }

    add(data) {
        return data
    }

    replace(id, data) {
        return { id: id, data: data }
    }

    modify(id, data) { 
        return { id: id, data: data }
    }

    delete(id) { 
        return id
    }
}