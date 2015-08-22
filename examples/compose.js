import dotty from 'dotty';

const getDescriptorProps = (descriptorName, composables) => {
  return composables.map(composable => {
    return dotty.get(composable, 'compose.' + descriptorName);
  });
};

function compose (...composables) {
  const composable = {};
  const methods = getDescriptorProps('methods', composables);

  composable.compose = (...args) => {};

  Object.assign(composable.compose, {
    methods: Object.assign({}, ...methods),
    properties: {},
    deepProperties: {},
    initializers: [],
    staticProperties: {},
    propertyDescriptors: {},
    staticPropertyDescriptors: {},
    configuration: {}
  });

  return composable;
};

export default compose;
