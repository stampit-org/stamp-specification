# Stamp Specification: Composables
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/stampit-org/stampit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Introduction

The composables specification exists in order to define a standard format for composable factory functions (called **stamps**), and ensure compatibility between different stamp implementations.

## Status

The specification is currently used by the following officially supported implementations:

* [Reference Implementation](examples/compose.js)
* [Stamp Utils](https://github.com/stampit-org/stamp-utils) Functional, microlibrary style stamp utilities.
* [Stampit 3.0](https://github.com/stampit-org/stampit) V3+ uses the stamp specification.
* [react-stamp](https://github.com/troutowicz/react-stamp) A great choice for `class`-free React components.

### Reading Function Signatures

This document uses the [Rtype specification](https://github.com/ericelliott/rtype#rtype) for function signatures:

```js
(param: type): returnType
```

### Composable

A **composable** is one of:

* A composable factory function (aka **stamp**) that returns object instances based on its **descriptor**.
* A POJO (Plain Old JavaScript Object) stamp descriptor.

```js
composable(options?: object, ...args?: any[]): instance: object
```

```js
const newObject = composable();
```

Stamps have a method called `.compose()`:

```js
stamp.compose(...args?: stamp|descriptor[]): stamp
```

When called the `.compose()` method creates new composable using the current composable as a base, composed with a list of *composables* or *descriptors* passed as arguments:

```js
const combinedComposable = baseComposable.compose(composable1, composable2, composable3);
```

### Descriptor

**Composable descriptor** (or just **descriptor**) is a meta data object which contains the information necessary to create an object instance. Descriptor properties are attached to the stamp `.compose()` method, e.g. `stamp.compose.methods`.



### Standalone `compose()` function (optional)

```js
(...args?: stamp|descriptor[]): stamp
```

**Creates stamps.** Take any number of stamps or descriptors. Return a new stamp that encapsulates combined behavior. If nothing is passed in, it returns an empty stamp.


## Implementation details

### Stamp

```js
stamp(options?: object, ...args?: any[]): instance: object
```

**Creates object instances.** Take an options object and return the resulting instance.


```js
stamp.compose(...args?: stamp|descriptor[]): stamp
```

**Creates stamps.**

A method exposed by all composables, identical to `compose()`, except it prepends `this` to the stamp parameters. Stamp descriptor properties are attached to the `.compose` method, e.g. `stamp.compose.methods`.


### The Stamp Descriptor

```js
interface descriptor {
  methods?: object,
  properties?: object,
  deepProperties?: object,
  propertyDescriptors?: object,
  staticProperties?: object,
  deepStaticProperties?: object,
  staticPropertyDescriptors?: object,
  initializers?: array,
  configuration?: object
}
```

The names and definitions of the fixed properties that form the stamp descriptor.
The stamp descriptor properties are made available on each stamp as `stamp.compose.*`

* `methods` - A set of methods that will be added to the object's delegate prototype.
* `properties` - A set of properties that will be added to new object instances by assignment.
* `deepProperties` - A set of properties that will be added to new object instances by assignment with deep property merge.
* `propertyDescriptors` - A set of [object property
descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) used for fine-grained control over object property behaviors.
* `staticProperties` - A set of static properties that will be copied by assignment to the stamp.
* `deepStaticProperties` - A set of static properties that will be added to the stamp by assignment with deep property merge.
* `staticPropertyDescriptors` - A set of [object property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) to apply to the stamp.
* `initializers` - A set of functions that will run in sequence. Stamp details and arguments get passed to initializers.
* `configuration` - A set of options made available to the stamp and its initializers during object instance creation. Configuration properties get deep merged.

#### Composing Descriptors

Descriptors are composed together to create new descriptors with the following rules:

* `methods` are copied by assignment: `descriptor.methods = _.assign({}, descriptor1.methods, descriptor2.methods)`
* `properties` are copied by assignment: `descriptor.properties = _.assign({}, descriptor1.properties, descriptor2.properties)`
* `deepProperties` are deep merged: `descriptor.deepProperties = _.merge({}, descriptor1.deepProperties, descriptor2.deepProperties)`
* `propertyDescriptors` are copied by assignment: `descriptor.propertyDescriptors = _.assign({}, descriptor1.propertyDescriptors, descriptor2.propertyDescriptors)`
* `staticProperties` are copied by assignment: `descriptor.staticProperties = _.assign({}, descriptor1.staticProperties, descriptor2.staticProperties)`
* `deepStaticProperties` are deep merged: `descriptor.deepStaticProperties = _.merge({}, descriptor1.deepStaticProperties, descriptor2.deepStaticProperties)`
* `staticPropertyDescriptors` are copied by assignment: `descriptor.propertyDescriptors = _.assign({}, descriptor1.propertyDescriptors, descriptor2.propertyDescriptors)`
* `initializers` are appended: `descriptor.initializers = descriptor1.initializers.concat(descriptor2.initializers)`
* `configuration` are deep merged: `descriptor.configuration = _.merge({}, descriptor1.configuration, descriptor2.configuration)`


#### Priority Rules

It is possible for properties to collide, between both stamps, and between different properties of the same stamp. This is often expected behavior, so it must not throw.

**Same descriptor property, different stamps:** Last in wins.

**Different descriptor properties, one or more stamps:**

* Shallow properties override deep properties
* Descriptors override everything

#### Configuration

Stamp composition and instance creation behaviors can be manipulated by configuration stamps. For example, it's possible to create [a stamp that warns on collisions](https://github.com/stampit-org/collision-stamp) across different descriptor properties. e.g.:

**Configuration Example**

```js
import warnOnCollisions from 'collision-stamp';

const config = compose({
  configuration: {
    collisions: {
      warnOnCollision: true,
      warn (msg) {
        const entry = {
          date: Date.now(),
          message: msg
        };
        console.log(JSON.stringify(entry));
      }
    }
  }
});

const myStamp = compose(config, warnOnCollisions);
```


### Stamp Options

It is recommended that stamps only take one argument: The stamp `options` argument. There are no reserved properties and no special meaning. However, using multiple arguments for a stamp could create conflicts where multiple stamps expect the same argument to mean different things. Using named parameters, it's possible for stamp creator to resolve conflicts with `options` namespacing. For example, if you want to compose a database connection stamp with a message queue stamp:

```js
const db = dbStamp({
  host: 'localhost',
  port: 3000,
  onConnect() {
    console.log('Database connection established.');
  }
});

const queue = messageQueueStamp({
  host: 'localhost',
  port: 5000,
  onComplete() {
    console.log('Message queue connection established.');
  }
});
```

If you tried to compose these directly, they would conflict with each other, but it's easy to namespace the options at compose time:

```js
const DbQueue = compose({
  initializers: [({db, queue}, { instance }) => {
    instance.db = dbStamp({
      host: db.host,
      port: db.port,
      onConnect: db.onConnect
    });
    instance.queue = messageQueueStamp({
      host: queue.host,
      port: queue.port,
      onConnect: queue.onConnect
    });
  }]
});

myDBQueue = DbQueue({
  db: {
    host: 'localhost',
    port: 3000,
    onConnect () {
      console.log('Database connection established.');
    }
  },
  queue: {
    host: 'localhost',
    port: 5000,
    onConnect () {
      console.log('Message queue connection established.');
    }
  }
});
```


### Initializer Parameters

Initializers have the following signature:

```js
(options: object, { instance: object, stamp: stamp, args: array }): instance: object
```

* `options` The `options` argument passed into the stamp, containing properties that may be used by initializers.
* `instance` The object instance being produced by the stamp. If the initializer returns a value other than `undefined`, it replaces the instance.
* `stamp` A reference to the stamp producing the instance.
* `args` An array of the arguments passed into the stamp, including the `options` argument.


-----

## Similarities With Promises (aka Thenables)

* *Thenable* ~ *Composable*.
* `.then` ~ `.compose`.
* *Promise* ~ *Stamp*.
* `new Promise(function(resolve, reject))` ~ `compose(...stampsOrDescriptors)`

-----
