import test from 'tape';
import compose from '../examples/compose';

const mergeProps = [
  'deepProperties',
  'deepStaticProperties',
  'configuration'
];


const build = (num) => {
  const composable = function(){};
  composable.compose = function(){};

  mergeProps.forEach(prop => {
    composable.compose[prop] = {
      a: {
        [num]: num,
        merge: {
          [num]: num
        }
      }
    };
  });

  return composable;
};

test('Deep property merge', nest => {

  // Loop over each property that is merged and ensure
  // that merge implemented correctly.
  mergeProps.forEach(prop => {

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
            a: { b: 1}
          }
        },
        {
          deepProperties: {
            a: { b: 2 }
          }
        })();
      const expected = { a: { b: 2 } };

      assert.deepEqual(actual, expected,
        `${ prop } conflicts should be merged with last-in priority.`);

      assert.end();
    });

  });
});
