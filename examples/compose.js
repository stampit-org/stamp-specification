import merge from 'lodash/object/merge';
import map from 'lodash/collection/map';
import isUndefined from 'lodash/lang/isUndefined';

const getDescriptorProps = (descriptorName, composables) => {
  return map(composables, composable => {
    const descriptor = composable.compose || composable;
    return descriptor[descriptorName];
  });
};

const createStamp = ({
      methods, properties, deepProperties, propertyDescriptors, initializers,
      staticProperties, deepStaticProperties, staticPropertyDescriptors
    })=> {

  const assign = Object.assign;

  const Stamp = function Stamp (options, ...args) {
    let obj = Object.create(methods);

    merge(obj, deepProperties);
    assign(obj, properties);

    Object.defineProperties(obj, propertyDescriptors);

    initializers.forEach(initializer => {
      const returnValue = initializer.call(obj, options,
        { instance: obj, stamp: Stamp, args: [options].concat(args) });
      if ( !isUndefined(returnValue) ) {
        obj = returnValue;
      }
    });

    return obj;
  };

  merge(Stamp, deepStaticProperties);
  assign(Stamp, staticProperties);

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

  const stamp = createStamp(composeMethod);

  stamp.compose = composeMethod;

  return stamp;
}

export default compose;
