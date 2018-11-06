aula-assignment

### Stack
We’ll use a simple NodeJS service with a MongoDB for our backend.
- NodeJS 11.0.0
- MongoDB 4.0.3

### How To Run

**cd into each microservice root directory**

Install service dependencies
```
$ yarn install
```
Seed initial service data
```
$ yarn seed
```

**Now you are ready for different commands**

Run tests
```
$ yarn tests
```
Run integration tests
```
$ yarn integration-tests
```
Start the service
```
$ yarn start
```
### Architecture
![aula-assignment-diagram](https://user-images.githubusercontent.com/44700926/48043615-38d7b100-e190-11e8-9040-b55bfcbb2b62.png)

*Solid lined and non-italicized has been implemented. Dashed and italicized is marked for improvement.*

### Conventions

**Latest ES used**

Latest ES features are used. `async/await` should be used in place of (explicit) promises and callbacks.

**Arrow vs regular functions**
When to use arrow functions and when to use regular functions?

`TLDR` from this [SO answer](https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6)
```
Use function in the global scope and for Object.prototype properties.

Use => everywhere else.
```
**Testing**

All unit testing should be conducted inside `spec/` in the related directory of the unit being tested. The file name can be anything ending with `.js`.

All integration testing should be inside the `integrations-tests/` directory located at the root folder of each micro-service.

### Improvements
**General**
* Api gateway should be used to handle client requests and composition.
* Micro-services should facilitate persistent, yet decoupled communication via events and messaging bus. One candidate for a quick, yet sound implementation is [https://github.com/ajacksified/Mediator.js](Mediator.js) for implementing the mediator pattern.
* Use `jwt` and have it seamlessly used in inter-service communication to identify and authorize users.
* Actual repositories should be considered for future enhancements instead of simple `Mongoose` models when accessing the databse. Repositiories, if implemented correctly, can help in providing abstractions and act as a useful middle layer between business and the database.
* The app should be dockerized as a step in solving the inherent deployablitly problem found in microservice architectures.
* Testing should be done in other than just happy-case, `200` and `array` is returned scenerios. What about `401`s for unauthorized users or `404`s for search terms that yield nothing?
* Implement actual error handling instead of simple `console.log`. How this is done would vary depending on needs, but as a start, an effective logging service should be used, related parties should be pinged when critical errors occur, and calculated fallbacks should be implemented.
* It may prove useful in using an opinionated, yet high quality library in building microservices. [https://github.com/zeit/micro](micro.js) may be one such candidate.

**Production Stage**
* Implement circuit breakers with controlled regression and fallbacks. No one likes scratching their head as to why the system is falling and it turns out to be a silently failing, overloaded microservice.
* Improve port allocation(currently, a random port is assigned to each service) and facilitate straight-forward service discovery.
* Use defined protocol when versioning. This can be useful when updating and ther is a need to serve legacy clients.
