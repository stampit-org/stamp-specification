const warn = ({ logger = console.log.bind(console) }, descriptor) => {
  const instanceProps = {};
  const staticProps = {};
  const instanceKeys = [
    'properties',
    'deepProperties',
    'propertyDescriptors'
  ];
  const staticKeys = [
    'staticProperties',
    'deepStaticProperties',
    'staticPropertyDescriptors'
  ];
  const warnings = [];

  instanceKeys.forEach(instanceKey => {
    for (let key in descriptor[instanceKey]) {
      if (instanceProps[key]) {
        warnings.push(
          `Collision between ${ instanceProps[key] } and ${ instanceKey }`
        );
      } else {
        instanceProps[key] = instanceKey;
      }
    }
  });

  staticKeys.forEach(staticKey => {
    for (let key in descriptor[staticKey]) {
      if (instanceProps[key]) {
        warnings.push(`Collision between ${ staticProps[key] }
          and ${ staticKey }`);
      } else {
        staticProps[key] = staticKey;
      }
    }
  });

  warnings.forEach(warning => {
    logger(warning);
  });
};

export default warn;
