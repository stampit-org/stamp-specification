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
    _.merge(descr.deepProperties, d.deepProperties);
    descr.initializers = descr.initializers.concat(d.initializers);
    _.assign(descr.staticProperties, d.staticProperties);
    _.merge(descr.propertyDescriptors, d.propertyDescriptors);
    _.merge(descr.configuration, d.configuration);
  });
  return descr;
}

// Internal function. Used to create composable factories.
function stamp(descriptor) {
  // Creating the composable factory, aka stamp.
  const composable = function composable(instance, ...args) {
    const descriptor = composable.compose;

    // context is what initializers will bind to. Also, it can become a new object if instance arg was not given.
    let context = Object.create(descriptor.methods || null);

    // Step 1. methods
    if (!_.isUndefined(instance)) {
       // user has passed an argument. Checking if it can have prototype.
      if (_.isObject(instance)) {
        // instance can be bound to. Thus it can serve as a context for initializers
        context = instance;

        // Replacing the prototype of the given instance if there are methods in this descriptor.
        if (!_.isEmpty(descriptor.methods)) {
          // Also we should not change any existing prototypes of any existing methods.
          if (Object.getPrototypeOf(instance) === Object.prototype) {
            instance.__proto__ = descriptor.methods;
          } else {
            // The given instance already has a prototype. Thus we assign methods straight into the instance.
            _.assign(instance, descriptor.methods);
          }
        }
      }
    }

    // Step 2. deepProperties
    _.merge(context, descriptor.deepProperties);

    // Step 3. properties
    _.assign(context, descriptor.properties); // properties are taking over deep props.

    // Step 4. propertyDescriptors
    Object.defineProperties(context, descriptor.propertyDescriptors);

    // Step 5. initializers
    let newInstance = _.isUndefined(instance) ? context : instance;
    (descriptor.initializers || []).forEach((init) => {
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
