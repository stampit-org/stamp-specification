import test from 'tape';
import compose from '../examples/compose';

const mergeProps = [
  'deepProperties',
  'configuration'
];

export default (() => {

  const build = (num) => {
    const compose = {};

    mergeProps.forEach(prop => {
      compose[prop] = {
        [num]: num,
        merge: {
          [num]: num
        }
      };
    });

    return { compose };
  }

  // Loop over each property that is merged and ensure
  // that merge implemented correctly.
  mergeProps.forEach( prop => {
    test(`${ prop } merge 1`, (assert) => {
      const subject = compose(build(1), build(2));
      const props = subject.compose;

      const actual = props[prop][1];
      const expected = 1;

      assert.equal(actual, expected,
        `${ prop } should be merged from first argument`);

      assert.end();
    });

    test(`${ prop } merge 2`, (assert) => {
      const subject = compose(build(1), build(2));
      const props = subject.compose;

      const actual = props[prop][2];
      const expected = 2;

      assert.equal(actual, expected,
        `${ prop } should be merged from 2nd argument`);

      assert.end();
    });

    test(`${ prop } merge 3`, (assert) => {
      const subject = compose(build(1), build(2), build(3));
      const props = subject.compose;

      const actual = props[prop][3];
      const expected = 3;

      assert.equal(actual, expected,
        `${ prop } should be merged from subsequent arguments`);

      assert.end();
    });

    test(`${ prop } merge collision`, (assert) => {
      const subject = compose( build(1), build(2) );
      const props = subject.compose;

      const actual = props[prop].merge;
      const expected = {
        [1]: 1,
        [2]: 2
      };

      assert.deepEqual(actual, expected,
        `${ prop } conflicts should be merged from colliding sources.`);

      assert.end();
    });
  });
}());
