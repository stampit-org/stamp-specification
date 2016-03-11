import test from 'tape';

const build = (num) => {

  const composable = function () {};
  composable.compose = function () {};
  composable.compose.initializers = [() => {
    return {num};
  }];

  return composable;
};

const buildInitializers = () => {

  const composable = function () {};
  composable.compose = function () {};
  composable.compose.initializers = [
    (options, { instance }) => {
      return Object.assign(instance, {
        a: 'a',
        override: 'a'
      });
    },
    (options, { instance }) => {
      return Object.assign(instance, {
        b: 'b'
      });
    },
    (options, { instance }) => {
      return Object.assign(instance, {
        override: 'c'
      });
    }
  ];
  return composable;
};


test('compose()', nest => {

  nest.test('...with no initializers', assert => {
    const subject = compose({ initializers: [ 0, 'a', null, undefined, {}, NaN, /regexp/ ]});
    const initializers = subject.compose.initializers;

    assert.notOk(initializers && initializers.length,
      'should not add any initializers');

    assert.end();
  });

  nest.test('...with two initializers', assert => {
    const subject = compose(build(1), build(2));
    const initializers = subject.compose.initializers;

    const actual = initializers[0]().num;
    const expected = 1;

    assert.equal(actual, expected,
      'should add initializer from first composable');

    assert.end();
  });

  nest.test('...with two initializers', assert => {
    const subject = compose(build(1), build(2));
    const initializers = subject.compose.initializers;

    const actual = initializers[1]().num;
    const expected = 2;

    assert.equal(actual, expected,
      'should add initializer from second composable');

    assert.end();
  });

  nest.test('...with three initializers', assert => {
    const subject = compose(build(1), build(2), build(3));
    const initializers = subject.compose.initializers;

    const actual = initializers[2]().num;
    const expected = 3;

    assert.equal(actual, expected,
      'should add initializer from subsequent composables');

    assert.end();
  });
});

test('stamp()', nest => {

  nest.test('...with initializers', assert => {
    const composable = function () {};
    composable.compose = function () {};
    composable.compose.properties = {
      'instanceProps': true
    };
    composable.compose.initializers = [
      function ({ stampOption }, { instance, stamp, args }) {
        const actual = {
          correctThisValue: this === instance,
          hasOptions: Boolean(stampOption),
          hasInstance: Boolean(instance.instanceProps),
          hasStamp: Boolean(stamp.compose),
          argsLength: args.length === 3
        };

        const expected = {
          correctThisValue: true,
          hasOptions: true,
          hasInstance: true,
          hasStamp: true,
          argsLength: true
        };

        assert.deepEqual(actual, expected,
          'should call initializer with correct signature');

        assert.end();
      }
    ];
    const testStamp = compose(composable);

    testStamp({stampOption: true}, 1, 2);
  });

  nest.test('...with overrides in initializer', assert => {
    const stamp = buildInitializers();

    const actual = compose(stamp)();
    const expected = {
      a: 'a',
      b: 'b',
      override: 'c'
    };

    assert.deepEqual(actual, expected,
      'should apply initializers with last-in priority');

    assert.end();
  });

  nest.test('...with args in initializer', assert => {
    const expected = [0, 'string', { obj: {} }, [1, 2, 3]];

    const composable = function () {};
    composable.compose = function () {};
    composable.compose.initializers = [
      function (options, { args }) {
        assert.deepEqual(args, expected,
          'should receive all given arguments');

        assert.end();
      }
    ];
    const testStamp = compose(composable);

    testStamp(expected[0], expected[1], expected[2], expected[3]);
  });

  nest.test('...with `this` in initializer', assert => {
    const composable = function () {};
    composable.compose = function () {};
    composable.compose.initializers = [
      function () {
        return Object.assign(this, {
          a: 'a'
        });
      }
    ];
    const stamp = compose(composable);

    const actual = compose(stamp)();
    const expected = {
      a: 'a'
    };

    assert.deepEqual(actual, expected,
      'should use object instance as `this` inside initializers');

    assert.end();
  });

  nest.test('...with rubbish` in initializer', assert => {
    const composable = function () {};
    composable.compose = function () {};
    composable.compose.initializers = [0, 1, null, NaN, 'string', true, false];
    const stamp = compose(composable);
    stamp.compose.initializers = [0, 1, null, NaN, 'string', true, false];

    const actual = compose(stamp)();
    const expected = {};

    assert.deepEqual(actual, expected,
      'should avoid non functions in initializers array');

    assert.end();
  });
});
