import test from 'tape';

const assignmentProps = [
  'methods',
  'properties',
  'deepProperties',
  'staticProperties',
  'staticDeepProperties',
  'configuration',
  'deepConfiguration'
];

const build = (num) => {
  const composable = function () {};
  composable.compose = function () {};

  assignmentProps.forEach(prop => {
    composable.compose[prop] = {
      [num]: num,
      override: num
    };
  });

  return composable;
};

// Loop over each property that is copied by assignment and ensure
// that copy and priority are implemented correctly.
assignmentProps.forEach(prop => {
  test(`${ prop } assignment 1`, (assert) => {
    const subject = compose(build(1), build(2));
    const props = subject.compose;

    const actual = props[prop][1];
    const expected = 1;

    assert.equal(actual, expected,
      `${ prop } should be copied by assignment from first argument`);

    assert.end();
  });

  test(`${ prop } assignment 2`, (assert) => {
    const subject = compose(build(1), build(2));
    const props = subject.compose;

    const actual = props[prop][2];
    const expected = 2;

    assert.equal(actual, expected,
      `${ prop } should be copied by assignment from 2nd argument`);

    assert.end();
  });

  test(`${ prop } assignment 3`, (assert) => {
    const subject = compose(build(1), build(2), build(3));
    const props = subject.compose;

    const actual = props[prop][3];
    const expected = 3;

    assert.equal(actual, expected,
      `${ prop } should be copied by assignment from subsequent arguments`);

    assert.end();
  });

  test(`${ prop } assignment priority`, (assert) => {
    const subject = compose(build(1), build(2));
    const props = subject.compose;

    const actual = props[prop].override;
    const expected = 2;

    assert.equal(actual, expected,
      `${ prop } should be copied by assignment with last-in priority`);

    assert.end();
  });
});
