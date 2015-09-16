import test from 'tape';
import compose from '../examples/compose';

test('Compose function output.', assert => {
  const actual = typeof compose();
  const expected = 'function';

  assert.equal(actual, expected,
    'compose() should return a function');

  assert.end();
});

test('Stamp', nest => {
  nest.test('...with no arguments', assert => {
    const actual = typeof compose()();
    const expected = 'object';

    assert.equal(actual, expected,
      'should produce an object instance');

    assert.end();
  });
});
