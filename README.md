# Composables specification

## Introduction

The composables specification exists in order to define a standard format for composable factory functions (called **stamps**), and ensure compatibility between different stamp implementations.


### Composable

**Composable** (aka **stamp**) is a composable factory function that returns object instances based on its **descriptor**.

```js
assert(typeof composable === 'function');

const newObject = composable();
```

It has property `.compose` which is also a function.
```js
assert(typeof composable.compose === 'function');
```

When called the `.compose` function creates new composable using the current composable as a base, composed with a list of *composables* passed as arguments.
```js
const combinedComposable = baseComposable.compose(composable1, composable2, composable3);
```

### Descriptor

**Composable descriptor** (or just **Descriptor**) is a meta data object with properties that contain the information necessary to create an object instance.



### Standalone `compose()` function (optional)

* `compose(...stampsOrDescriptors) => stamp` **Creates stamps.** Take any number of stamps or descriptors.
Return a new stamp that encapsulates combined behavior. If nothing is passed in, it returns an empty stamp.


## Implementation details

### Stamp

* `stamp(baseObject, args...) => objectInstance` **Creates object instances.** Take a base object and any number of arguments. Return the mutated `baseObject` instance back. If no first argument is passed, it uses a new empty object as the base object. If present, an existing prototype of the base object must not be mutated. Instead, the behavior (methods) must be added to the base object itself.
 * `.compose(stampsOrDescriptors...) => stamp` **Creates stamps.** *A method exposed by all composables, identical to `compose()`, except it prepends `this` to the stamp parameters. Stamp descriptor properties are attached to the `.compose` method., i.e. `stamp.compose.*`


### The Stamp Descriptor

The names and definitions of the fixed properties that form the stamp descriptor.
The stamp descriptor properties are made available on each stamp as `stamp.compose.*`

* `methods` - A set of methods that will be added to the object's delegate prototype.
* `properties` - A set of properties that will be added to new object instances by assignment.
* `deepProperties` - A set of properties that will be added to new object instances by assignment with deep property merge.
* `initializers` - A set of functions that will run in sequence. Stamp details and arguments get passed to initializers.
* `staticProperties` - A set of static properties that will be copied by assignment to the stamp.
* `propertyDescriptors` - A set of [object property
descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) used for fine-grained control over object property behaviors.
* `staticPropertyDescriptors` - A set of [object property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) to apply to the stamp.
* `configuration` - A set of options made available to the stamp and its initializers during object instance creation. Configuration properties get deep merged.

#### Composing descriptors

Descriptors are composed together to create new descriptors with the following rules:

* `methods` are copied by assignment: `descriptor.methods = _.assign({}, descriptor1.methods, descriptor2.methods)`
* `properties` are copied by assignment: `descriptor.properties = _.assign({}, descriptor1.properties, descriptor2.properties)`
* `deepProperties` are deep merged: `descriptor.deepProperties = _.merge({}, descriptor1.deepProperties, descriptor2.deepProperties)`
* `initializers` are appended: `descriptor.initializers = descriptor1.initializers.concat(descriptor2.initializers)`
* `staticProperties` are copied by assignment: `descriptor.staticProperties = _.assign({}, descriptor1.staticProperties, descriptor2.staticProperties)`
* `propertyDescriptors` are copied by assignment: `descriptor.propertyDescriptors = _.assign({}, descriptor1.propertyDescriptors, descriptor2.propertyDescriptors)`
* `staticPropertyDescriptors` are copied by assignment: `descriptor.propertyDescriptors = _.assign({}, descriptor1.propertyDescriptors, descriptor2.propertyDescriptors)`
* `configuration` are deep merged: `descriptor.configuration = _.merge({}, descriptor1.configuration, descriptor2.configuration)`

### Initializer parameters

Initializers are passed an `options` argument containing:

```js
{
  instance,
  stamp,
  args
}
```

* `instance` The object instance being produced by the stamp. If the initializer returns a new object, it replaces the instance.
* `stamp` A reference to the stamp producing the instance.
* `args` Any arguments passed to the stamp function.


-----

## Similarities with Promises (aka Thenables)

* *Thenable* ~ *Composable*.
* `.then` ~ `.compose`.
* *Promise* ~ *Stamp*.
* `new Promise(resolve, reject)` ~ `compose(...stampsOrDescriptors)`

-----
