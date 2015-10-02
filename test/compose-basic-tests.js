import test from 'tape';
import compose from '../examples/compose';

test('compose function', assert => {
  const actual = typeof compose;
  const expected = 'function';

  assert.equal(actual, expected,
    'compose should be a function.');

  assert.end();
});

test('compose() descriptor creation', assert => {
  const descriptorPropNames = [
    'methods',
    'properties',
    'deepProperties',
    'staticProperties',
    'deepStaticProperties',
    'propertyDescriptors',
    'staticPropertyDescriptors',
    'configuration',
    'initializers'
  ];

  const stamp = compose();

  const actual = () => {
    const obj = {};
    descriptorPropNames.forEach(propName => {
      obj[ propName + ' exists'] = Boolean(stamp.compose[propName]);
    });
    return obj;
  }();

  const expected = () => {
    const obj = {};
    descriptorPropNames.forEach(propName => {
      obj[ propName + ' exists'] = true;
    });
    return obj;
  }();

  assert.deepEqual(actual, expected,
    'All descriptor properties should be added to stamp descriptor');

  assert.end();
});

test('compose.staticProperties', nest => {
  ['staticProperties', 'deepStaticProperties'].forEach(descriptorName => {

    nest.test('...for descriptor', assert => {
      const actual = compose({
        [ descriptorName ]: {
          a: 'a'
        }
      }, {
        [ descriptorName ]: {
          b: 'b'
        }
      }).compose[ descriptorName ];

      const expected = {
        a: 'a',
        b: 'b'
      };

      assert.deepEqual(actual, expected,
        `should compose ${ descriptorName } into descriptor`);

      assert.end();
    });

    nest.test('...for stamp', assert => {
      const stamp = compose({
        [ descriptorName ]: {
          a: 'a'
        }
      }, {
        [ descriptorName ]: {
          b: 'b'
        }
      });

      const actual = Object.assign({}, {
        a: stamp.a,
        b: stamp.b
      });

      const expected = {
        a: 'a',
        b: 'b'
      };

      assert.deepEqual(actual, expected,
        `should add ${ descriptorName } to stamp`);

      assert.end();
    });

  });
});
