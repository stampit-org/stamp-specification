/*
This is an example implementation of the Stamp Specifications.
See https://github.com/stampit-org/stamp-specification
The code is optimized to be as readable as possible.
*/

import {isObject, isFunction, isPlainObject, assign, uniq, isArray} from 'lodash';

// Specification says that arrays are not mergeable, they must be concatenated only.
const isMergeable = value => !isArray(value) && isObject(value);

// Descriptor is typically a function or a plain object. But not an array!
const isDescriptor = isMergeable;

// Stamps are functions, which have `.compose` attached function.
const isStamp = value => isFunction(value) && isFunction(value.compose);

/**
 * Mutate the 'dst' by deep merging the 'src'. Though, arrays are concatenated.
 * @param {*} dst The object to deep merge 'src' into.
 * @param {*} src The object to merge data from.
 * @returns {*} Typically it's the 'dst' itself, unless it was an array or a non-mergeable.
 * Or the 'src' itself if the 'src' is a non-mergeable.
 */
function mergeOne(dst, src) {
  if (src === undefined) return dst;

  // According to specification arrays must be concatenated. 'src' overrides 'dst'.
  if (isArray(src)) return (isArray(dst) ? dst : []).concat(src);

  // Now deal with non plain 'src' object. 'src' overrides 'dst'
  if (!isPlainObject(src)) return src; // src overwrites dst

  return Object.keys(src).reduce(
    (returnValue, key) => {
      // deep merge each property. Recursion!
      returnValue[key] = mergeOne(returnValue[key], src[key]);
      return returnValue;
    },
    // See if 'dst' is allowed to be mutated. If not - it becomes a new plain object.
    isMergeable(dst) ? dst : {}
  );
}

/**
 * Stamp specific deep merging algorithm.
 * @param {*} dst
 * @param {Array} srcs
 * @returns {*} Typically it's the 'dst' itself, unless it was an array or a non-mergeable.
 * Or the 'src' itself if the 'src' is a non-mergeable.
 */
export function merge(dst, ...srcs) {
  // TODO: unit test the entire new algorithm!!!!
  return srcs.reduce((target, src) => mergeOne(target, src), dst);
}

/**
 * Creates new factory instance.
 * @param {object} descriptor The information about the object the factory will be creating.
 * @returns {Function} The new factory function.
 */
function createFactory(descriptor) {
  return function Stamp(options = {}, ...args) {
    // The 'methods' metadata object becomes the prototype for new object instances.
    const obj = Object.create(descriptor.methods || {});

    // Deep merge, then override with shallow merged properties, then apply property descriptors.
    merge(obj, descriptor.deepProperties);
    assign(obj, descriptor.properties);
    Object.defineProperties(obj, descriptor.propertyDescriptors || {});

    // Run initializers sequentially.
    return (descriptor.initializers || [])
      .filter(isFunction)
      .reduce((resultingObj, initializer) => {
        // Invoke an initializer in the way specification tell us to.
        const returnedValue = initializer.call(
          // 'this' context will be the object instance itself
          resultingObj,
          // the first argument passed from factory to initializer
          options,
          // special arguments. See specification.
          {instance: resultingObj, stamp: Stamp, args: [options].concat(args)}
        );

        // Any initializer can override the object instance with basically anything.
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

  // Deep merge, then override with shallow merged properties, then apply property descriptors.
  merge(Stamp, descriptor.staticDeepProperties);
  assign(Stamp, descriptor.staticProperties);
  Object.defineProperties(Stamp, descriptor.staticPropertyDescriptors || {});

  // Determine which 'compose' implementation to use.
  const composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction;
  // Make a copy of the 'composeImplementation' function.
  Stamp.compose = function (...args) {
    return composeImplementation.apply(this, args);
  };
  // Assign descriptor properties to the new metadata holder.
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
  // Check if it's a stamp or something else.
  const srcDescriptor = isStamp(srcComposable) ? srcComposable.compose : srcComposable;
  // Ignore everything but things we can merge.
  if (!isDescriptor(srcDescriptor)) return dstDescriptor;

  const combineProperty = (propName, action) => {
    // Do not create destination properties if there is no need.
    if (!isDescriptor(srcDescriptor[propName])) return;
    // Check if the destination is malformed, fix the problem if any.
    if (!isDescriptor(dstDescriptor[propName])) dstDescriptor[propName] = {};
    // Deep merge or shallow assign objects.
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

  if (isArray(srcDescriptor.initializers)) {
    // The initializers must be an array. Always. If not - we fix it. TODO: unit test!
    let dstInitializers = isArray(dstDescriptor.initializers) ? dstDescriptor.initializers : [];
    // The initializers array must contain function only.
    dstInitializers = dstInitializers.concat(srcDescriptor.initializers).filter(isFunction);
    // The initializers array must not have duplicate initializers. The first occurrence wins.
    dstDescriptor.initializers = uniq(dstInitializers);
  }

  return dstDescriptor;
}

/**
 * Given the list of composables (stamp descriptors and stamps)
 * returns a new stamp (composable factory function).
 * @param {...(object|Function)} [composables] The list of composables.
 * @returns {Function} A new stamp (aka composable factory function).
 */
export default function compose(...composables) {
  // Merge metadata of all composables to a new plain object.
  const descriptor = [this].concat(composables).filter(isMergeable).reduce(mergeComposable, {});
  // Pass self as the 'compose' implementation which will be used for `Stamp.compose()`
  return createStamp(descriptor, compose);
}
