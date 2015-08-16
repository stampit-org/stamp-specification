# Composables specification

## Introduction

The composables specification exists in order to define a standard format for composable factory functions (called **stamps**). It exists to ensure compatibility between different stamp implementations.


### Composable

**Composable** is a factory function. It returns object instances based on its **descriptor**.

```js
assert(typeof composable === 'function');

const newObject = composable();
```

It has property `.compose` which is also a function.
```js
assert(typeof composable.compose === 'function');
```

When called the `.compose` function creates **new** *composables* based on the current and a given list of *composables*.
```js
const combinedComposable = composable0.compose(composable1, composable2, composable3);
```

### Descriptor

**Composable descriptor** (or just **Descriptor**) is a meta data object.
It's a collection of properties that contain the information necessary to create an object instance by a *composable*.

### Stamp

**Stamp** is a *composable* with a fixed *descriptor* mixed into the `.compose` function.


### Standalone `compose()` function (optional)

* `compose(...stampsOrDescriptors) => stamp` **Creates stamps.** Take any number of stamps or descriptors.
Return a new stamp that encapsulates combined behavior. If nothing is passed in, it returns an empty stamp.

-----

## Similarities with Promises (aka Thenables)

* *Thenable* ~ *Composable*.
* `.then` ~ `.compose`.
* *Promise* ~ *Stamp*.
* `new Promise(resolve, reject)` ~ `compose(...stampsOrDescriptors)`

-----

## Implementation details

### Stamp

* `stamp([instance], args...) => objectInstance` **Creates or mutates object instances.** Take a base object and any number of arguments.
Return the mutated `baseObject` instance back. If no first argument is passed, it uses a new empty object as the base object.
Stamps with function or array base objects should not extend the built-in prototypes for `Object` or `Array`.
  * `.compose(stampsOrDescriptors...) => stamp` **Creates stamps.** *A method exposed by all composables (i.e., stamps).*
    Take any number of stamps or descriptors, create and return a new stamp that encapsulates combined behavior
    of `this` and the arguments. Stamp descriptor properties are attached to the `.compose` method., i.e. `stamp.compose.*`


## The Stamp Descriptor

The names and definitions of the fixed properties that form the stamp descriptor.
The stamp descriptor properties are made available on each stamp as `stamp.compose.*`

* `methods` - A set of methods that will be added to the object's delegate prototype.
* `properties` - A set of properties that will be added to new object instances by assignment.
* `deepProperties` - A set of properties that will be added to new object instances by assignment with deep property merge.
* `initializers` - A set of functions that will run in sequence and passed the data necessary to initialize a stamp instance.
* `staticProperties` - A set of static properties that will be copied by assignment to the stamp.
* `propertyDescriptors` - A set of [object property
descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
used for fine-grained control over object property behaviors
* `configuration` - A set of options made available to the stamp and its initializers during object instance creation.
Configuration properties get deep merged.

#### Composing descriptors

Descriptors are composed together to create new descriptors with the following rules:

* `methods` are shallow mixed: `descr.methods = _.assign({}, descr1.methods, descr2.methods)`
* `properties` are shallow mixed: `descr.properties = _.assign({}, descr1.properties, descr2.properties)`
* `deepProperties` are deep merged: `descr.deepProperties = _.merge({}, descr1.deepProperties, descr2.deepProperties)`
* `initializers` are stacked: `descr.initializers = descr1.initializers.concat(descr1.initializers)`
* `staticProperties` are shallow mixed: `descr.staticProperties = _.assign({}, descr1.staticProperties, descr2.staticProperties)`
* `propertyDescriptors` are deep merged: `descr.propertyDescriptors = _.merge({}, descr1.propertyDescriptors, descr2.propertyDescriptors)`
* `configuration` are deep merged: `descr.configuration = _.merge({}, descr1.configuration, descr2.configuration)`
