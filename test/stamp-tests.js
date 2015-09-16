import test from 'tape';
import compose from '../examples/compose';

test('compose()', assert => {
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

test('Stamp.compose()', nest => {
  nest.test('...type', assert => {
    const actual = typeof compose().compose;
    const expected = 'function';

    assert.equal(actual, expected,
      'should be a function');

    assert.end();
  });

  nest.test('...with no arguments', assert => {
    const actual = typeof compose().compose().compose;
    const expected = 'function';

    assert.equal(actual, expected,
      'should return a new stamp');

    assert.end();
  });
});
