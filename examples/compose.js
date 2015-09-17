import merge from 'lodash/object/merge';
import map from 'lodash/collection/map';

const getDescriptorProps = (descriptorName, composables) => {
  return map(composables, 'compose.' + descriptorName);
};

const createStamp = descriptor => {
  return ({ instance } = {}) => {
    const proto = {};
    const obj = instance || {};

    // Set up prototype
    Object.assign(proto, descriptor.methods);
    Object.setPrototypeOf(obj, proto);

    Object.assign(obj, descriptor.properties);

    descriptor.initializers.forEach(initializer => {
      initializer.call(obj, { instance: obj });
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
