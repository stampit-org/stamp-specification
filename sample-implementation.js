/**
 * DISCLAIMER
 *
 * This implementation does not have any safety checks or optimizations.
 * Instead, the code is highly readable.
 */

import _ from 'lodash';

export function isComposable(obj) {
  return _.isFunction(obj) && _.isFunction(obj.compose);
}
export function isDescriptor(obj) {
  return _.isObject(obj);
}
function mixDescriptors(...args) {
  const descr = {
    methods: {},
    properties: {},
    deepProperties: {},
    initializers: [],
    staticProperties: {},
    propertyDescriptors: {},
    configuration: {},
  };
  _.forEach(args, (d) => {
    if (!isDescriptor(d)) {
      return;
    }
    _.assign(descr.methods, d.methods);
    _.assign(descr.properties, d.properties);
    _.assign(descr.deepProperties, d.deepProperties);
    descr.initializers = descr.initializers.concat(d.initializers);
    _.assign(descr.staticProperties, d.staticProperties);
    _.assign(descr.propertyDescriptors, d.propertyDescriptors);
    _.assign(descr.configuration, d.configuration);
  });
  return descr;
}

// Internal function. Used to create composable factories.
function stamp(descriptor) {
  // Creating the composable factory, aka stamp.
  const composable = function composable(instance, ...args) {
    const descriptor = composable.compose;
     // context is what initializers will bind to.
    const context = _.isObject(instance) ? instance : Object.create(descriptor.methods || null);
    _.merge(context, composable.compose.deepProperties);
    _.assign(context, composable.compose.properties); // properties are taking over deep props.
    // TODO: apply propertyDescriptors here
    // TODO: apply configuration?
    let newInstance = _.isUndefined(instance) ? context : instance;
    (composable.compose.initializers || []).forEach((init) => {
      if (!_.isFunction(init)) {
        return;
      }
      const result = init.call(context, {instance: newInstance, stamp: composable, args});
      if (!_.isUndefined(result)) {
        newInstance = result;
      }
    });
    return newInstance;
  };

  // Set static properties of the factory (aka stamp, aka composable).
  _.assign(composable, descriptor.staticProperties);

  // The stamp descriptor, aka stamp.compose().
  // The .bind() creates a new  instance of the compose() function.
  // Overwriting a possible static function '.compose'.
  composable.compose = _.assign(compose.bind(composable), descriptor);

  return composable;
}

// Accepts both stamp descriptors and stamps.
export default function compose(...args) {
  const descriptors = args.map(function (arg) {
    if (isComposable(arg)) {
      return arg.compose;
    }
    else if (isDescriptor(arg)) {
      return arg;
    }
  });
  if (this) {
    descriptors.unshift(this);
  }

  return stamp(mixDescriptors(descriptors));
}
