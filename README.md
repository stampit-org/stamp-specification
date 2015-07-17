# Composables specification

## Introduction

### Composable

**Composable** is a factory function. It returns an object instance based on its **descriptor**.

```js
assert(typeof composable === 'function');

const newObject = composable();
```

It has property `.compose` which is also a function.
```js
typeof composable.compose === 'function'
```

When called the `.compose` function creates **new** *composables* from the current and a given list of *composables*.
```js
const combinedComposables = composable0.compose(composable1, composable2, composable3);
```

### Descriptor

**Composable descriptor** (or just **Descriptor**) is a meta data object. It's a collection of properties that contain the information necessary to create an object instance by a *composable*.

### Stamp

**Stamp** is a *composable* with a fixed *descriptor* mixed into the `.compose` function.

### Similarities with Promises (aka Thenables)

* *Thenable* ~ *Composable*.
* `.then` ~ `.compose`.
* *Promise* ~ *Stamp*.

-----

## Default exports - the `compose` function

* `compose(stampsOrDescriptors...) => stamp` **Creates stamps.** Take any number of stamps or descriptors. Return a new stamp that encapsulates combined behavior.

## Stamp

* `stamp(baseObject, args...) => objectInstance` **Creates object instances.** Take a base object and any number of arguments. Return the mutated `baseObject` instance back. If no first argument is passed, it uses an empty object as the base object.
 * `.compose(stampsOrDescriptors...) => stamp` **Creates stamps.** *a method exposed by all composables (i.e., stamps)* identical to `compose()`, except it prepends `this` to the stamp parameters. Stamp descriptor properties are attached to the `.compose` method., i.e. `stamp.compose.*`

### `stamp(baseObject, arguments...) => objectInstance`

`stamp()` should be able to take multiple types of objects and simply extend them, e.g., a function or an array. However, stamps with function or array base objects should not extend the built-in prototypes for `Object` or `Array`.

### `compose(stamps...) => stamp`

Compose takes any number of stamps as arguments and returns a new stamp composed from the passed in stamps. If no stamps are passed in, it returns an empty stamp.


## The Stamp Descriptor

The names and definitions of the fixed properties that form the stamp descriptor. The stamp descriptor properties are made available on each stamp as `stamp.compose.*`

* `methods` - A set of methods that will be added to the object's delegate prototype.
* `references` - A set of properties that will be added to new object instances by assignment.
* `deepProperties` - A set of properties that will be added to new object instances by assignment with deep property merge.
* `initializers` - A set of functions that will run in sequence and passed the data necessary to initialize a stamp instance.
* `staticProperties` - A set of static properties that will be copied by assignment to the stamp.
* `propertyDescriptors` - A set of [object property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) used for fine-grained control over object property behaviors
* `configuration` - A set of options made available to the stamp and its initializers during object instance creation. Configuration properties get deep merged.

## Core stamp creation utilities

* `compose(stamps) => stamp`: Composes stamps
* `assign(objects...) => stamp`: Creates objects like object.assign, but always creates a new stamp rather than using the first param as destination. This will be familiar to anybody who uses ES6+ or lodash.assign()
* `merge(objects...) => stamp`: Like `assign()`, but merge deep properties
* `initialize(functions...) => stamp`: Functions to run during instance creation. Return value gets used as the current instance
* `assignStatic(objects...) => stamp` Assigns arguments as static properties on the stamp (as opposed to instances).
* `describe(propertyDescriptors...) => stamp`: Property descriptors with presets.
* `configure(options...) => stamp`: Creates a new stamp with stamp options. e.g. descriptor presets. Users can use this to implement custom stamp types via initializer.


## Extended utilities - Useful utilities not part of the standard specifications.

* `set(pathString, value) => stamp`: Creates a mergeable stamp using a deep property setter string. e.g. `set('obj.with.deep.properties', value)`
* `reactComponent(componentDescription) => stamp`: Creates a stamp that describes a react component. See [react-stampit](https://github.com/stampit-org/react-stampit)
* `html(htmlString) => stamp`: Take a DOM node HTML string and returns a stamp that produces DOM nodes
* `legacyStampit() => compatableStamp`: Return an instance of the v2 legacy API for fluent chaining.
