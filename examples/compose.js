import dotty from 'dotty';
import merge from 'lodash/object/merge';

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
    deepProperties: merge({}, ...getDescriptorProps('deepProperties', composables)),
    initializers: [].concat(...getDescriptorProps('initializers', composables)),
    staticProperties: Object.assign({}, ...getDescriptorProps('staticProperties', composables)),
    propertyDescriptors: Object.assign({}, ...getDescriptorProps('propertyDescriptors', composables)),
    staticPropertyDescriptors: Object.assign({}, ...getDescriptorProps('staticPropertyDescriptors', composables)),
    configuration: merge({}, ...getDescriptorProps('configuration', composables))
  });

  return composable;
};

export default compose;
