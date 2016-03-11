import test from 'tape';
import _ from 'lodash';

const mergeProps = [
  'deepProperties',
  'staticDeepProperties',
  'deepConfiguration'
];


test('Deep property merge', nest => {

  // Loop over each property that is merged and ensure
  // that merge implemented correctly.
  mergeProps.forEach(prop => {

    const build = (num) => {
      const composable = function () {};
      composable.compose = function () {};
      composable.compose[prop] = {
        a: {
          [num]: num,
          merge: {
            [num]: num
          }
        }
      };

      return composable;
    };

    nest.test(`...${ prop } merge 1`, (assert) => {
      const subject = compose(build(1), build(2));
      const props = subject.compose;

      const actual = props[prop].a[1];
      const expected = 1;

      assert.equal(actual, expected,
        `${ prop } should be merged from first argument`);

      assert.end();
    });

    nest.test(`...${ prop } merge 2`, (assert) => {
      const subject = compose(build(1), build(2));
      const props = subject.compose;

      const actual = props[prop].a[2];
      const expected = 2;

      assert.equal(actual, expected,
        `${ prop } should be merged from 2nd argument`);

      assert.end();
    });

    nest.test(`...${ prop } merge 3`, (assert) => {
      const subject = compose(build(1), build(2), build(3));
      const props = subject.compose;

      const actual = props[prop].a[3];
      const expected = 3;

      assert.equal(actual, expected,
        `${ prop } should be merged from subsequent arguments`);

      assert.end();
    });

    nest.test(`...${ prop } merge collision`, (assert) => {
      const actual = compose(
        {
          deepProperties: {
            a: {b: 1}
          }
        },
        {
          deepProperties: {
            a: {b: 2}
          }
        })();
      const expected = {a: {b: 2}};

      assert.deepEqual(actual, expected,
        `${ prop } conflicts should be merged with last-in priority.`);

      assert.end();
    });

  });
});


test('Deep array merge', nest => {

  // Loop over each property that is merged and ensure
  // that merge implemented correctly.
  mergeProps.forEach(prop => {

    function deepMerge(a, b) {
      return compose({[prop]: a}, {[prop]: b}).compose[prop];
    }

    nest.test('array replaces object', (t) => {
      const a = {
        foo: {
          bar: 'bam'
        }
      };
      const b = {
        foo: ['a', 'b', 'c']
      };
      const expected = {
        foo: ['a', 'b', 'c']
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);
      t.notEqual(actual.foo, b.foo, 'array replacing object should be deep merged: c.foo !== b.foo');

      t.end();
    });

    nest.test('object replaces array', (t) => {
      const a = {
        foo: ['a', 'b', 'c']
      };
      const b = {
        foo: {
          bar: 'bam'
        }
      };
      const expected = {
        foo: {
          bar: 'bam'
        }
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.notEqual(actual.foo, b.foo, 'object replacing array should be deep merged: c.foo !== b.foo');

      t.end();
    });

    nest.test('array concat', (t) => {
      const a = {
        foo: [1, 2, 3]
      };
      const b = {
        foo: ['a', 'b', 'c']
      };
      const expected = {
        foo: [1, 2, 3, 'a', 'b', 'c']
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);
      t.notEqual(actual.foo, b.foo, 'array should be deep merged from right: c.foo === b.foo');

      t.end();
    });

    nest.test('number replaces array', (t) => {
      const a = {
        foo: [1, 2, 3]
      };
      const b = {
        foo: 99
      };
      const expected = {
        foo: 99
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('array replaces number', (t) => {
      const a = {
        foo: 99
      };
      const b = {
        foo: [1, 2, 3]
      };
      const expected = {
        foo: [1, 2, 3]
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('string replaces array', (t) => {
      const a = {
        foo: [1, 2, 3]
      };
      const b = {
        foo: 'abc'
      };
      const expected = {
        foo: 'abc'
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });


    nest.test('array replaces string', (t) => {
      const a = {
        foo: 'abc'
      };
      const b = {
        foo: [1, 2, 3]
      };
      const expected = {
        foo: [1, 2, 3]
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('boolean true replaces array', (t) => {
      const a = {
        foo: [1, 2, 3]
      };
      const b = {
        foo: true
      };
      const expected = {
        foo: true
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('array replaces boolean true', (t) => {
      const a = {
        foo: true
      };
      const b = {
        foo: [1, 2, 3]
      };
      const expected = {
        foo: [1, 2, 3]
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('boolean false replaces array', (t) => {
      const a = {
        foo: [1, 2, 3]
      };
      const b = {
        foo: false
      };
      const expected = {
        foo: false
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('array replaces boolean false', (t) => {
      const a = {
        foo: false
      };
      const b = {
        foo: [1, 2, 3]
      };
      const expected = {
        foo: [1, 2, 3]
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });


    nest.test('null replaces array', (t) => {
      const a = {
        foo: [1, 2, 3]
      };
      const b = {
        foo: null
      };
      const expected = {
        foo: null
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('array replaces null', (t) => {
      const a = {
        foo: null
      };
      const b = {
        foo: [1, 2, 3]
      };
      const expected = {
        foo: [1, 2, 3]
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('array replaces undefined', (t) => {
      const a = {};
      const b = {
        foo: [1, _, _.noop]
      };
      const expected = {
        foo: [1, _, _.noop]
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('undefined does not replace array', (t) => {
      const a = {
        foo: [1, _, _.noop]
      };
      const b = {
        foo: undefined
      };
      const expected = {
        foo: [1, _, _.noop]
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });

    nest.test('number replace array', (t) => {
      const a = {
        foo: [1, 2, 3]
      };
      const b = {
        foo: 42
      };
      const expected = {
        foo: 42
      };

      const actual = deepMerge(a, b);
      const expectedMsg = 'result expected  : ' + JSON.stringify(expected);

      t.deepEqual(actual, expected, expectedMsg);

      t.end();
    });
  });
});
