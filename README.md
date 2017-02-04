# KambojaJs

[![Build Status](https://travis-ci.org/kambojajs/kamboja.svg?branch=master)](https://travis-ci.org/kambojajs/kamboja)
[![Coverage Status](https://coveralls.io/repos/github/kambojajs/kamboja/badge.svg?branch=master)](https://coveralls.io/github/kambojajs/kamboja?branch=master)

NodeJS MVC Framework powered by TypeScript

# API Convention
You don't need to decorate your classes or method to get clean API below:

```
GET    /user/page/<offset>/<take>
GET    /user/<id>
POST   /user  
       {<payload body>}
PUT    /user/<id>
       {<payload body>}
DELETE /user/<id>
```

what you need todo is:

```javascript
export class UserController : ApiController{
    getByPage(offset, take){ /* your code */ }
    get(id){ /* your code */ }
    add(body){ /* your code */ }
    modify(id, body){ /* your code */ }
    delete(id){ /* your code */ }
}

```

Remember you are free to name your parameter KambojaJs will detect it for you.

# Default Convention
For non API controller your method name will be the route

```javascript
export class CarController : Controller{
    getList(index, take){
        return this.view()
    }
}
```

With code above KambojaJs will generate

```
GET /car/getlist/:index/:take
```

# Http Decorator
By default all action will be translated as HTTP GET, if you need 
other method you need to add decorators

```javascript
export class CarController : Controller{
    @http.post()
    save(body){
        return this.json({success:true})
    }
}
```

Code above will generate

```
POST /car/save
     {<payload body>}
```

If you not happy with the generated route or you want a custom route 
you can provide parameter on the http decorator

```javascript
export class CarController : Controller{
    @http.post("/garage/save")
    save(body){
        return this.json({success:true})
    }
}
```

Code above will generate 

```
POST /garage/save
     {<payload body>}
```

You are free to assigned multiple http decorators into an action, 
this behavior will make the action accessible from many routes.


```javascript
export class CarController : Controller{
    @http.get("/dashboard")
    @http.get("/dashboard/property")
    @http.get("/dashboard/property/car")
    @http.get("/dashboard/property/car/list")
    list(){
        return this.json({success:true})
    }
}
```

# Internal Decorator
TypeScript's generated javascript doesn't leave information about 
private method so KambojaJs will guess all of your method as public. 
You can mark a method as @internal if you want KambojaJs exclude 
the method from route generation.


```javascript
export class CarController : Controller{
    @internal()
    private thisIsPrivate(){
        return "sssttt.."
    }

    list(){
        return this.json(this.thisIsPrivate())
    }
}
```

# Async/Await support
With TypeScript 2.1 support async/await on ES5, we can use it also 
inside the controller

```javascript
export class CarController : Controller{
    @internal()
    private slowLoadingAsync(): Promise<string>{ }

    async list(){
        let result = await this.slowLoadingAsync()
        return this.json(result)
    }
}
```

> Important note when using callback style libraries
>> Event if you are free to return value or promise, don't be confused
>> if using callback style libraries.

If using callback style inside controller we need to 
return promise manually

```javascript
export class CarController : Controller{

    list(){
        return new Promise<string>((resolve, reject) => {
            fs.readFile(function(err, result){
                if(err) reject(err)
                else {
                    /* do your work */
                    resolve(<result>)
                }
            })
        })
    }
}
```


# Error handling using try-catch
Another TypeScript 2.1 feature we also can do try-catch error 
inside controller. The error will nicely passed through the 
error handler.

```javascript
export class CarController : Controller{
    async list(){
        try{
            let result = await this.slowLoadingAsync()
            return this.json(result)
        }
        catch(e){
            throw new Error("Something bad happened")
        }
    }
}
```

# Flexible Engine
KambojaJs not totally created from scratch instead it designed so it can sits on top 
of another framework such as ExpressJs(implemented), Koa(in progress).
This is good so we can reuse any great existing library like BodyParser and some middleware

# Issue Analysis
KambojaJs comes with issue analysis, it will identify common mistakes developer make.
- Detect non exported controller
- Detect if there is controller doesn't inherited from ApiController or Controller
- Detect if @internal decorator combined with @http decorator
- Detect if an Api naming convention in an action fail caused by lack of parameters
- Detect un match parameter name between route and action when using custom route
- Detect if Controller method accidentally overridden such as json, redirect, file, view 
- Detect if there are duplicate route happened.