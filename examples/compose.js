import merge from 'lodash/object/merge';
import map from 'lodash/collection/map';

const getDescriptorProps = (descriptorName, composables) => {
  return map(composables, 'compose.' + descriptorName);
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

const createStamp = descriptor => {
  return function Stamp (options = {}) {
    const { instance } = options;
    const methods = descriptor.methods;
    const obj = createInstanceWithProto({ instance, methods });

    Object.assign(obj, descriptor.properties);

    descriptor.initializers.forEach(initializer => {
      initializer.call(obj, options, { instance: obj, stamp: Stamp });
    });

    return obj;
  };
};


function compose (...composables) {

  const composeMethod = function (...args) {
    return compose({ compose: composeMethod }, ...args);
  };

  Object.assign(composeMethod, {
    methods: Object.assign({}, ...getDescriptorProps('methods', composables)),
    properties: Object.assign({}, ...getDescriptorProps('properties', composables)),
    deepProperties: merge({}, ...getDescriptorProps('deepProperties', composables)),
    initializers: [].concat(...getDescriptorProps('initializers', composables))
      .filter(initializer => initializer !== undefined),
    staticProperties: Object.assign({}, ...getDescriptorProps('staticProperties', composables)),
    propertyDescriptors: Object.assign({}, ...getDescriptorProps('propertyDescriptors', composables)),
    staticPropertyDescriptors: Object.assign({}, ...getDescriptorProps('staticPropertyDescriptors', composables)),
    configuration: merge({}, ...getDescriptorProps('configuration', composables))
  });

  const stamp = createStamp(composeMethod);

  stamp.compose = composeMethod;

  return stamp;
}

export default compose;
