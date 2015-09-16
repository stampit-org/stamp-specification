import merge from 'lodash/object/merge';
import map from 'lodash/collection/map';

const getDescriptorProps = (descriptorName, composables) => {
  return map(composables, 'compose.' + descriptorName);
};

function compose (...composables) {

  const composeMethod = () => {};

  Object.assign(composeMethod, {
    methods: Object.assign({}, ...getDescriptorProps('methods', composables)),
    properties: Object.assign({}, ...getDescriptorProps('properties', composables)),
    deepProperties: merge({}, ...getDescriptorProps('deepProperties', composables)),
    initializers: [].concat(...getDescriptorProps('initializers', composables)),
    staticProperties: Object.assign({}, ...getDescriptorProps('staticProperties', composables)),
    propertyDescriptors: Object.assign({}, ...getDescriptorProps('propertyDescriptors', composables)),
    staticPropertyDescriptors: Object.assign({}, ...getDescriptorProps('staticPropertyDescriptors', composables)),
    configuration: merge({}, ...getDescriptorProps('configuration', composables))
  });

  const composable = ({
    instance = {}
  } = {}) => {

    composeMethod.initializers.forEach(initializer => {
      initializer({ instance });
    });

    return instance;
  };

  composable.compose = composeMethod;

  return composable;
};

export default compose;
