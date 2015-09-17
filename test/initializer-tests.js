import test from 'tape';
import compose from '../examples/compose';


const build = (num) => {

  const composable = {
    initializers: [() => {
      return { num };
    }]
  };

  return { compose: composable };
};

const buildInitializers = () => {

  return {
    compose: {
      initializers: [
        ({ instance }) => {
          return Object.assign(instance, {
            a: 'a',
            override: 'a'
          });
        },
        ({ instance }) => {
          return Object.assign(instance, {
            b: 'b'
          });
        },
        ({ instance }) => {
          return Object.assign(instance, {
            override: 'c'
          });
        }
      ]
    }
  };
};


test('compose()', nest => {

  nest.test(`...with two initializers`, assert => {
    const subject = compose(build(1), build(2));
    const initializers = subject.compose.initializers;

    const actual = initializers[0]().num;
    const expected = 1;

    assert.equal(actual, expected,
      'should add initializer from first composable');

    assert.end();
  });

  nest.test(`...with two initializers`, assert => {
    const subject = compose(build(1), build(2));
    const initializers = subject.compose.initializers;

    const actual = initializers[1]().num;
    const expected = 2;

    assert.equal(actual, expected,
      'should add initializer from second composable');

    assert.end();
  });

  nest.test(`...with three initializers`, assert => {
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

  nest.test('...with `this` in initializer', assert => {
    const stamp = compose({
      compose: {
        initializers: [
          function () {
            return Object.assign(this, {
              a: 'a'
            });
          }
        ]
      }
    });

    const actual = compose(stamp)();
    const expected = {
      a: 'a'
    };

    assert.deepEqual(actual, expected,
      'should use object instance as `this` inside initializers');

    assert.end();
  });
});
