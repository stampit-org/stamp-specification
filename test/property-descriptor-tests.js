import test from 'tape';
import _ from 'lodash';

const createDescriptors = () => {
  const a = {
    value: 'a',
    writable: false,
    configurable: false,
    enumerable: false
  };
  const b = Object.assign({}, a);
  const descriptors = {
    a,
    b
  };
  return descriptors;
};

test('stamp', nest => {
  nest.test('...with propertyDescriptors', assert => {
    const descriptors = createDescriptors();
    const b = descriptors.b;

    const obj = compose({
      propertyDescriptors: Object.assign({}, descriptors)
    })();

    const actual = Object.getOwnPropertyDescriptor(obj, 'b');
    const expected = Object.assign({}, b);

    assert.deepEqual(actual, expected,
      'should assign propertyDescriptors to instances');

    assert.end();
  });

  nest.test('...with malformed propertyDescriptors', assert => {
    [0, 'a', null, undefined, {}, NaN, /regexp/].forEach(propertyValue => {
      const actual = compose({
        propertyDescriptors: propertyValue
      })();
      const expected = {};

      assert.deepEqual(actual, expected,
        'should not any properties instances');
    });

    assert.end();
  });

  nest.test('...with malformed staticPropertyDescriptors', assert => {
    [0, 'a', null, undefined, {}, NaN, /regexp/].forEach(propertyValue => {
      const stamp = compose({
        staticPropertyDescriptors: propertyValue
      });
      const actual = _.values(stamp.compose).filter(value => !_.isEmpty(value)).length;
      const expected = 0;

      assert.equal(actual, expected,
        'should not add any descriptor data');
    });

    assert.end();
  });

  nest.test('...with propertyDescriptors and existing prop conflict', assert => {
    const descriptors = createDescriptors();

    const obj = compose({
        properties: {
          a: 'existing prop'
        }
      },
      {
        propertyDescriptors: Object.assign({}, descriptors)
      })();

    const actual = obj.a;
    const expected = 'a';

    assert.deepEqual(actual, expected,
      'should assign propertyDescriptors to instances & override existing prop');

    assert.end();
  });

  nest.test('...with staticPropertyDescriptors', assert => {
    const descriptors = createDescriptors();
    const b = descriptors.b;

    const stamp = compose({
      staticPropertyDescriptors: Object.assign({}, descriptors)
    });

    const actual = Object.getOwnPropertyDescriptor(stamp, 'b');
    const expected = Object.assign({}, b);

    assert.deepEqual(actual, expected,
      'should assign staticProperties to stamp');

    assert.end();
  });
});
