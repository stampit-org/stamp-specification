import merge from 'lodash/object/merge';
import map from 'lodash/collection/map';
import warn from './warn-on-collision';

const getDescriptorProps = (descriptorName, composables) => {
  return map(composables, composable => {
    const descriptor = composable.compose || composable;
    return descriptor[descriptorName];
  });
};

const createInstanceWithProto = ({ instance, methods }) => {

  // If an instance is passed in, we need to mutate the instance,
  // but we must not mutate the instance prototype, so we need to
  // insert a new prototype into the prototype chain.
  if (instance) {
    const obj = instance;

    // Mutating an existing prototype chain has deep perf
    // implications for all code that uses any instance,
    // so only do this if it's needed.
    if (Object.keys(methods).length) {
      // Get the original prototype
      const instanceProto = Object.getPrototypeOf(instance);

      // Set prototype
      const proto = Object.assign(Object.create(instanceProto), methods);
      Object.setPrototypeOf(obj, proto);
    }

    return obj;

  } else {
    // set prototype
    const obj = Object.create(methods);

    return obj;
  }
};

const createStamp = ({
      methods, properties, propertyDescriptors, initializers,
      staticProperties, deepStaticProperties, staticPropertyDescriptors
    })=> {

  const assign = Object.assign;

  const Stamp = function Stamp (options = {}) {
    const { instance } = options;
    const obj = createInstanceWithProto({ instance, methods });

    assign(obj, properties);

    Object.defineProperties(obj, propertyDescriptors);

    initializers.forEach(initializer => {
      initializer.call(obj, options, { instance: obj, stamp: Stamp });
    });

    return obj;
  };

  assign(Stamp, deepStaticProperties, staticProperties);

  Object.defineProperties(Stamp, staticPropertyDescriptors);

  return Stamp;
};


function compose (...composables) {
  const assign = Object.assign;

  const composeMethod = function (...args) {
    return compose({ compose: composeMethod }, ...args);
  };

  const configuration = merge({},
    ...getDescriptorProps('configuration', composables));

  assign(composeMethod, {
    methods: assign({}, ...getDescriptorProps('methods', composables)),
    deepProperties: merge({},
      ...getDescriptorProps('deepProperties', composables)),
    properties: assign({}, ...getDescriptorProps('properties', composables)),
    deepStaticProperties: merge({},
      ...getDescriptorProps('deepStaticProperties', composables)),
    staticProperties: assign({},
      ...getDescriptorProps('staticProperties', composables)),
    propertyDescriptors: assign({},
      ...getDescriptorProps('propertyDescriptors', composables)),
    staticPropertyDescriptors: assign({},
      ...getDescriptorProps('staticPropertyDescriptors', composables)),
    initializers: [].concat(...getDescriptorProps('initializers', composables))
      .filter(initializer => initializer !== undefined),
    configuration
  });

  if (configuration.warnOnCollision) {
    warn(configuration, composeMethod);
  }

  const stamp = createStamp(composeMethod);

  stamp.compose = composeMethod;

  return stamp;
}

export default compose;
