import test from 'tape';

const build = (prop, key, val = key) => {
  const composable = function () {};
  composable.compose = function () {};

  composable.compose[prop] = {
    [val]: val
  };

  return composable;
};

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

test('Stamp assignments', nest => {
  nest.test('...with properties', assert => {
    const composable = function () {};
    composable.compose = function () {};
    composable.compose.properties = {
      a: 'a',
      b: 'b'
    };
    const stamp = compose(composable);

    const actual = stamp();
    const expected = {
        a: 'a',
        b: 'b'
    };

    assert.deepEqual(actual, expected,
      'should create properties');

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

  nest.test('...with base defaults', assert => {
    const stamp1 = compose(build('properties', 'a'));
    const stamp2 = compose(build('properties', 'b'));
    const finalStamp = stamp1.compose(stamp2);

    const actual = finalStamp();
    const expected = {
        a: 'a',
        b: 'b'
    };

    assert.deepEqual(actual, expected,
      'should use Stamp as base composable');

    assert.end();
  });
});
