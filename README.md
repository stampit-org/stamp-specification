# Stamp Specification v1.6
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/stampit-org/stampit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) ![Greenkeeper Badge](https://badges.greenkeeper.io/stampit-org/stamp-specification.svg)

## Introduction

This specification exists in order to define a standard format for composable factory functions (called **stamps**), and ensure compatibility between different stamp implementations.

## Status

The specification is currently used by the following officially supported implementations:

* [Reference Implementation](./compose.js)
* [`@stamp`](https://www.npmjs.com/~stamp) Ecosystem of useful stamps
* [Stampit 3.0](https://github.com/stampit-org/stampit) V3+ uses the stamp specification.
* [Stamp Utils](https://github.com/stampit-org/stamp-utils) Functional, microlibrary style stamp utilities.
* [react-stamp](https://github.com/troutowicz/react-stamp) A great choice for `class`-free React components.

### Reading Function Signatures

This document uses the [Rtype specification](https://github.com/ericelliott/rtype#rtype) for function signatures:

```js
(param: Type) => ReturnType
```

### Composable

```js
interface Composable: Stamp|Descriptor
```

A **composable** is one of:

* A stamp.
* A POJO (Plain Old JavaScript Object) stamp descriptor.


### Stamp

A **stamp** is a composable factory function that returns object instances based on its **descriptor**.


```js
stamp(options?: Object, ...args?: [...Any]) => instance: object
```

```js
const newObject = stamp();
```

Stamps have a method called `.compose()`:

```js
Stamp.compose(...args?: [...Composable]) => Stamp
```

When called the `.compose()` method creates new stamp using the current stamp as a base, composed with a list of *composables* passed as arguments:

```js
const combinedStamp = baseStamp.compose(composable1, composable2, composable3);
```

The `.compose()` method doubles as the stamp's descriptor. In other words, descriptor properties are attached to the stamp `.compose()` method, e.g. `stamp.compose.methods`.


#### Overriding `.compose()` method

It is possible to override the `.compose()` method of a stamp using `staticProperties`. Handy for debugging purposes.

```js
import differentComposeImplementation from 'different-compose-implementation';
const composeOverriddenStamp = stamp.compose({
  staticProperties: {
    compose: differentComposeImplementation
  }
});  
```


### Descriptor

**Composable descriptor** (or just **descriptor**) is a meta data object which contains the information necessary to create an object instance.



### Standalone `compose()` pure function (optional)

```js
(...args?: [...Composable]) => Stamp
```

**Creates stamps.** Take any number of stamps or descriptors. Return a new stamp that encapsulates combined behavior. If nothing is passed in, it returns an empty stamp.

#### Detached `compose()` method

The `.compose()` method of any stamp can be detached and used as a standalone `compose()` pure function.

```js
const compose = thirdPartyStamp.compose;
const myStamp = compose(myComposable1, myComposable2);
```

## Implementation details

### Stamp

```js
Stamp(options?: Object, ...args?: [...Any]) => Instance: Object
```

**Creates object instances.** Take an options object and return the resulting instance.


```js
Stamp.compose(...args?: [...Composable]) => Stamp
```

**Creates stamps.**

A method exposed by all stamps, identical to `compose()`, except it prepends `this` to the stamp parameters. Stamp descriptor properties are attached to the `.compose` method, e.g. `stamp.compose.methods`.


### The Stamp Descriptor

```js
interface Descriptor {
  methods?: Object,
  properties?: Object,
  deepProperties?: Object,
  propertyDescriptors?: Object,
  staticProperties?: Object,
  staticDeepProperties?: Object,
  staticPropertyDescriptors?: Object,
  initializers?: [...Function],
  composers?: [...Function],
  configuration?: Object,
  deepConfiguration?: Object
}
```

The names and definitions of the fixed properties that form the stamp descriptor.
The stamp descriptor properties are made available on each stamp as `stamp.compose.*`

* `methods` - A set of methods that will be added to the object's delegate prototype.
* `properties` - A set of properties that will be added to new object instances by assignment.
* `deepProperties` - A set of properties that will be added to new object instances by deep property merge.
* `propertyDescriptors` - A set of [object property
descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) used for fine-grained control over object property behaviors.
* `staticProperties` - A set of static properties that will be copied by assignment to the stamp.
* `staticDeepProperties` - A set of static properties that will be added to the stamp by deep property merge.
* `staticPropertyDescriptors` - A set of [object property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) to apply to the stamp.
* `initializers` - An array of functions that will run in sequence while creating an object instance from a stamp. Stamp details and arguments get passed to initializers.
* `composers` - An array of functions that will run in sequence while creating a new stamp from a list of composables. The resulting stamp and the composables get passed to composers. 
* `configuration` - A set of options made available to the stamp and its initializers during object instance creation. These will be copied by assignment.
* `deepConfiguration` - A set of options made available to the stamp and its initializers during object instance creation. These will be deep merged.

#### Composing Descriptors

Descriptors are composed together to create new descriptors with the following rules:

* `methods` are copied by assignment
* `properties` are copied by assignment
* `deepProperties` are deep merged
* `propertyDescriptors` are copied by assignment
* `staticProperties` are copied by assignment
* `staticDeepProperties` are deep merged
* `staticPropertyDescriptors` are copied by assignment
* `initializers` are uniquely concatenated as in `_.union()`.
* `composers` are uniquely concatenated as in `_.union()`.
* `configuration` are copied by assignment
* `deepConfiguration` are deep merged

##### Copying by assignment

The special property assignment algorithm shallow merges the following properties:
* The regular string key properties `obj.foo = "bla"`
* The `Symbol` key properties `obj[Symbol.for('foo')] = "bla"`
* The JavaScript getters and setters `{ get foo() { return "bla"; }, set foo(val) { ... } }`

##### Deep merging

Special deep merging algorithm should be used when merging descriptors.

Values:
* Plain objects are deeply merged (or cloned if destination metadata property is not a plain object)
* Arrays are concatenated using `Array.prototype.concat` which shallow copies elements to a new array instance
* All other value types - Functions, Strings, non-plain objects, RegExp, etc. - are copied by reference
* The last value type always overwrites the previous value type

Keys:
* The `Symbol` object keys are treated as regular string keys
* The JavaScript getters and setters are merged as if they are regular functions, i.e. copied by reference

#### Priority Rules

It is possible for properties to collide, between both stamps, and between different properties of the same stamp. This is often expected behavior, so it must not throw.

**Same descriptor property, different stamps:** Last in wins.

**Different descriptor properties, one or more stamps:**

* Shallow properties override deep properties
* Property Descriptors override everything


### Stamp Arguments

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
(options: Object, { instance: Object, stamp: Stamp, args: Array }) => instance?: Object
```

* `options` The `options` argument passed into the stamp, containing properties that may be used by initializers.
* `instance` The object instance being produced by the stamp. If the initializer returns a value other than `undefined`, it replaces the instance.
* `stamp` A reference to the stamp producing the instance.
* `args` An array of the arguments passed into the stamp, including the `options` argument.

Note that if no `options` object is passed to the factory function, an empty object will be passed to initializers.

### Composer Parameters

Composers have the following signature:

```js
({ stamp: Stamp, composables: Composable[] }) => stamp?: Object
```

* `stamp` The result of the composables composition.
* `composables` The list of composables the `stamp` was just composed of.

Note that it's not recommended to return new stamps from a composer. Instead, it's better to mutate the passed `stamp`.

-----

## Similarities With Promises (aka Thenables)

* *Thenable* ~ *Composable*.
* `.then` ~ `.compose`.
* *Promise* ~ *Stamp*.
* `new Promise(function(resolve, reject))` ~ `compose(...composables)`

-----

## Contributing

To contribute, please refer to the [Contributing guide](./CONTRIBUTING.md).
