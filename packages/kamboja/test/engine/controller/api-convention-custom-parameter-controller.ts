import { ApiController, val } from "../../../src"

export class DummyApi extends ApiController {
    get(id, root) {
        return {
            id: id,
            root: root
        }
    }

    list(iOffset, iLimit, root) {
        return {
            iOffset: iOffset,
            iLimit: iLimit,
            root: root
        }
    }

    add(data, root) {
        return {
            data: data,
            root: root
        }
    }

    replace(id, data, root) {
        return {
            id: id,
            data: data,
            root: root
        }
    }

    modify(id, data, root) {
        return {
            id: id,
            data: data,
            root: root
        }
    }

    delete(id, root) {
        return {
            id: id,
            root: root
        }
    }
}