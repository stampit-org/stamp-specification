# Composables specification

## Introduction

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
const combinedComposables = composable0.compose(composable1, composable2, composable3);
```

### Descriptor

**Composable descriptor** (or just **Descriptor**) is a meta data object.
It's a collection of properties that contain the information necessary to create an object instance by a *composable*.

### Stamp

**Stamp** is a *composable* with a fixed *descriptor* mixed into the `.compose` function. I.e. `stamp.compose.*`.

### Similarities with Promises (aka Thenables)

* *Thenable* ~ *Composable*.
* `.then` ~ `.compose`.
* *Promise* ~ *Stamp*.

-----

## Implementation details

New stamps can be created by calling a standalone `compose()` function.

### Standalone `compose()` function

* `compose(stampsOrDescriptors...) => stamp` **Creates stamps.** Take any number of stamps or descriptors.
Return a new stamp that encapsulates combined behavior. If nothing is passed in, it returns an empty stamp.

### Stamp

* `stamp(baseObject, args...) => objectInstance` **Creates object instances.**
Take a base object and any number of arguments. Return the mutated `baseObject` instance back.
If no first argument is passed, it uses a new empty object as the base object.
Stamps with function or array base objects should not extend the built-in prototypes for `Object` or `Array`.
  * `.compose(stampsOrDescriptors...) => stamp` **Creates stamps.** *a method exposed by all composables (i.e., stamps)*
  identical to `compose()`, except it prepends `this` to the stamp parameters.
  Stamp descriptor properties are attached to the `.compose` method., i.e. `stamp.compose.*`


### The Stamp Descriptor

The names and definitions of the fixed properties that form the stamp descriptor.
The stamp descriptor properties are made available on each stamp as `stamp.compose.*`
They all are *optional*, i.e. might not exists.

* `methods` - A set of methods that will be added to the object's delegate prototype.
* `assigns` - A set of properties that will be added to new object instances by assignment.
* `merges` - A set of properties that will be added to new object instances by assignment with deep property merge.
* `runs` - A set of functions that will run in sequence and passed the data necessary to initialize a stamp instance.
* `statics` - A set of static properties that will be copied by assignment to the stamp, but not object instances.
* `propertyDescriptors` - A set of [object property
descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
used for fine-grained control over object property behaviors
* `configs` - A set of options made available to the stamp and its initializers during object instance creation.

#### Combining descriptors

Several descriptors are combined together to create new descriptors with the following rules:

* `methods` are shallow mixed: `descr.methods = _.assign({}, descr1.methods, descr2.methods)`
* `assigns` are shallow mixed: `descr.assigns = _.assign({}, descr1.assigns, descr2.assigns)`
* `merges` are deep merged: `descr.merges = _.merge({}, descr1.merges, descr2.merges)`
* `runners` are stacked: `descr.runs = descr1.runs.concat(descr1.runs)`
* `statics` are shallow mixed: `descr.statics = _.assign({}, descr1.statics, descr2.statics)`
* `propertyDescriptors` are deep merged using `Object.defineProperties`: `descr.propertyDescriptors = _.describe({}, descr1.propertyDescriptors, descr2.propertyDescriptors)`
* `configs` are deep merged: `descr.configs = _.merge({}, descr1.configs, descr2.configs)`
