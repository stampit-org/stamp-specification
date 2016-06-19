/*
This is an example implementation of the Stamp Specifications.
See https://github.com/stampit-org/stamp-specification
The code is optimized to be as readable as possible.
 */

import {mergeWith, assign, isFunction, isObject, uniq} from 'lodash';

const isDescriptor = isObject;
export const merge = (dst, src) => mergeWith(dst, src, (dstValue, srcValue) => {
  if (Array.isArray(dstValue)) {
    if (Array.isArray(srcValue)) return dstValue.concat(srcValue);
    if (isObject(srcValue)) return merge({}, srcValue);
  }
});

/**
 * Creates new factory instance.
 * @param {object} descriptor The information about the object the factory will be creating.
 * @returns {Function} The new factory function.
 */
function createFactory(descriptor) {
  return function Stamp(options = {}, ...args) {
    let obj = Object.create(descriptor.methods || {});

    merge(obj, descriptor.deepProperties);
    assign(obj, descriptor.properties);
    Object.defineProperties(obj, descriptor.propertyDescriptors || {});

    return (descriptor.initializers || [])
      .filter(isFunction)
      .reduce((resultingObj, initializer) => {
        const returnedValue = initializer.call(
          resultingObj,
          options,
          {instance: resultingObj, stamp: Stamp, args: [options].concat(args)}
        );
        return returnedValue === undefined ? resultingObj : returnedValue;
      }, obj);
  };
}

/**
 * Returns a new stamp given a descriptor and a compose function implementation.
 * @param {object} [descriptor={}] The information about the object the stamp will be creating.
 * @param {Function} composeFunction The "compose" function implementation.
 * @returns {Function}
 */
function createStamp(descriptor, composeFunction) {
  const Stamp = createFactory(descriptor);

  merge(Stamp, descriptor.staticDeepProperties);
  assign(Stamp, descriptor.staticProperties);
  Object.defineProperties(Stamp, descriptor.staticPropertyDescriptors || {});

  const composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction;
  Stamp.compose = function () {
    return composeImplementation.apply(this, arguments);
  };
  assign(Stamp.compose, descriptor);

  return Stamp;
}

/**
 * Mutates the dstDescriptor by merging the srcComposable data into it.
 * @param {object} dstDescriptor The descriptor object to merge into.
 * @param {object} [srcComposable] The composable (either descriptor or stamp) to merge data form.
 * @returns {object} Returns the dstDescriptor argument.
 */
function mergeComposable(dstDescriptor, srcComposable) {
  const srcDescriptor = (srcComposable && srcComposable.compose) || srcComposable;
  if (!isDescriptor(srcDescriptor)) return dstDescriptor;

  const combineProperty = (propName, action) => {
    if (!isObject(srcDescriptor[propName])) return;
    if (!isObject(dstDescriptor[propName])) dstDescriptor[propName] = {};
    action(dstDescriptor[propName], srcDescriptor[propName]);
  };

  combineProperty('methods', assign);
  combineProperty('properties', assign);
  combineProperty('deepProperties', merge);
  combineProperty('propertyDescriptors', assign);
  combineProperty('staticProperties', assign);
  combineProperty('staticDeepProperties', merge);
  combineProperty('staticPropertyDescriptors', assign);
  combineProperty('configuration', assign);
  combineProperty('deepConfiguration', merge);
  if (Array.isArray(srcDescriptor.initializers)) {
    const initializers = (dstDescriptor.initializers || [])
      .concat(srcDescriptor.initializers)
      .filter(isFunction);
    dstDescriptor.initializers = uniq(initializers);
  }

  return dstDescriptor;
}

/**
 * Given the list of composables (stamp descriptors and stamps) returns a new stamp (composable factory function).
 * @param {...(object|Function)} [composables] The list of composables.
 * @returns {Function} A new stamp (aka composable factory function).
 */
export default function compose(...composables) {
  const descriptor = [this].concat(composables).filter(isObject).reduce(mergeComposable, {});
  return createStamp(descriptor, compose);
}
