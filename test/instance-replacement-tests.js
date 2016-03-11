import test from 'tape';

[0, 1, null, NaN, 'string', true, false].forEach(obj => {
  test('initializer returns ' + obj, assert => {
    compose({
      initializers: [
        () => {
          return obj;
        },
        (options, { instance }) => {
          const actual = typeof instance;
          const expected = typeof obj;

          assert.equal(actual, expected,
            'initializer return value should replace instance');

          assert.end();
        }
      ]
    })();
  });
});


test('initializer returns undefined', assert => {
  compose({
    initializers: [
      () => {
        return undefined;
      },
      (options, { instance }) => {
        const actual = typeof instance;
        const expected = 'object';

        assert.equal(actual, expected,
          'initializer return value should not replace instance');

        assert.end();
      }
    ]
  })();
});

test('instance replacement', assert => {
  const message = 'instance replaced';
  const newInstance = {
    message: message
  };

  const obj = compose({
    initializers: [
      () => {
        return newInstance;
      }
    ]
  })();

  const actual = obj.message;
  const expected = message;

  assert.equal(actual, expected,
    'the replaced instance value should be returned from the stamp');

  assert.end();
});
