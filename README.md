# KambojaJs

[![npm version](https://badge.fury.io/js/kamboja.svg)](https://badge.fury.io/js/kamboja)
[![Build Status](https://travis-ci.org/kambojajs/kamboja.svg?branch=master)](https://travis-ci.org/kambojajs/kamboja)
[![Coverage Status](https://coveralls.io/repos/github/kambojajs/kamboja/badge.svg?branch=master)](https://coveralls.io/github/kambojajs/kamboja?branch=master)

KambojaJS aims to fix some problems occurs when using the [old guy](https://expressjs.com/), and increase testability, add convention over configuration and use modern language feature like async/await decorator etc, read more http://kambojajs.com/

## Convention Over Configuration

KambojaJS route generation system generate url using pattern below:

```
<namespace>/<controller>/<action>?<parameter1>=value&<parameter2>=value 
```

Example you define controller like below

```typescript
import { Controller } from "kamboja"

export namespace Api.v01
  export class UserController extends Controller {
    list(query:string, offset:number, limit:number){ }
  }
}
```

Above code by default will generate a GET url below

```
/api/v01/user/list?query=<value>&offset=<value>&limit=<value>
```

Refer to [controller](http://kambojajs.com/reference/controller) reference for more information

For more advanced use, KambojaJS provide a convention for creating Restful API by using [ApiController](http://kambojajs.com/reference/api-controller)

Example controller below will create Restful API url for you

```typescript
import { ApiController } from "kamboja"

namespace Api.V1 {
    export class ItemsController extends ApiController {
        //GET /api/v1/items/:id
        get(id:string) { }
        //GET /api/v1/items?offset=1&limit=<optional>
        list(offset:number, limit=50){ }
        //POST /api/v1/items
        add(data){ }
        //DELETE /api/v1/items/:id
        delete(id:string){ }
        //PUT /api/v1/items/:id
        replace(id:string, data){ }
        //PATCH /api/v1/items/:id
        modify(id:string, data){}
    }
}
```

Above code will generate some urls:

```
GET     /api/v1/items/:id
GET     /api/v1/items?offset=1&limit=<optional>
POST    /api/v1/items
DELETE  /api/v1/items/:id
PUT     /api/v1/items/:id
PATCH   /api/v1/items/:id
```

Refer to [ApiController](http://kambojajs.com/reference/api-controller) for more information



