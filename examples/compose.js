import dotty from 'dotty';

const getDescriptorProps = (descriptorName, composables) => {
  return composables.map(composable => {
    return dotty.get(composable, 'compose.' + descriptorName);
  });
};

function compose (...composables) {
  const composable = {};

  composable.compose = (...args) => {};

  Object.assign(composable.compose, {
    methods: Object.assign({}, ...getDescriptorProps('methods', composables)),
    properties: Object.assign({}, ...getDescriptorProps('properties', composables)),
    deepProperties: {},
    initializers: [],
    staticProperties: {},
    propertyDescriptors: Object.assign({}, ...getDescriptorProps('propertyDescriptors', composables)),
    staticPropertyDescriptors: Object.assign({}, ...getDescriptorProps('staticPropertyDescriptors', composables)),
    configuration: {}
  });

  return composable;
};

export default compose;
