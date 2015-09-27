import test from 'tape';
import compose from '../examples/compose';
import './descriptor-tests';
import './assignment-tests';
import './merge-tests';
import './initializer-tests';
import './stamp-tests';

test('compose function', assert => {
  const actual = typeof compose;
  const expected = 'function';

  assert.equal(actual, expected,
    'compose should be a function.');

  assert.end();
});

test('compose.methods', assert => {
  const actual = Boolean(compose().compose.methods);
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.methods');

  assert.end();
});


test('compose.properties', assert => {
  const actual = Boolean(compose().compose.properties);
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.properties');

  assert.end();
});


test('compose.deepProperties', assert => {
  const actual = Boolean(compose().compose.deepProperties);
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.deepProperties');

  assert.end();
});


test('compose.initializers', assert => {
  const actual = Boolean(compose().compose.initializers);
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.initializers');

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


test('compose.propertyDescriptors', assert => {
  const actual = Boolean(compose().compose.propertyDescriptors);
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.propertyDescriptors');

  assert.end();
});


test('compose.staticPropertyDescriptors', assert => {
  const actual = Boolean(compose().compose.staticPropertyDescriptors);
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.staticPropertyDescriptors');

  assert.end();
});


test('compose.configuration', assert => {
  const actual = Boolean(compose().compose.configuration);
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.configuration');

  assert.end();
});
