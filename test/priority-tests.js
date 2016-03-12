import test from 'tape';

const buildDescriptor = (obj) => {
  return Object.assign({}, {
    properties: {
      a: 'props',
      b: 'props'
    }
  }, obj);
};

test('compose override priorities', nest => {
  nest.test('...with instance', assert => {
    const stamp = compose(buildDescriptor());
    const actual = stamp({ instance: {
      a: 'instance'
    }}).a;
    const expected = 'props';

    assert.equal(actual, expected,
      'properties should override instance props');

    assert.end();
  });

  nest.test('...with deepProperties', assert => {
    const stamp = compose(
      buildDescriptor({
        deepProperties: {
          a: 'deepProps'
        }
      }));
    const actual = stamp().a;
    const expected = 'props';

    assert.equal(actual, expected,
      'shallow properties should override deep properties');

    assert.end();
  });

  nest.test('...with descriptors', assert => {
    const stamp = compose(
      buildDescriptor({
        propertyDescriptors: {
          b: {
            value: 'propertyDescriptors'
          }
        }
      }));

    const actual = stamp().b;
    const expected = 'propertyDescriptors';

    assert.equal(actual, expected,
      'descriptors should override shallow properties');
    assert.end();
  });

  nest.test('...with instance & deepProperties', assert => {
    const stamp = compose(buildDescriptor({
      deepProperties: {
        c: 'deep'
      }
    }));
    const actual = stamp({ instance: {
      c: 'instance'
    }}).c;
    const expected = 'deep';

    assert.equal(actual, expected,
      'deepProperties should override instance props');

    assert.end();
  });

  nest.test('...with staticProperties', assert => {
    const stamp = compose({
      staticDeepProperties: {
        d: 'deep'
      },
      staticProperties: {
        d: 'staticProps'
      }
    });
    const actual = stamp.d;
    const expected = 'staticProps';

    assert.equal(actual, expected,
      'staticProperties should override staticDeepProperties');
    assert.end();
  });
});
