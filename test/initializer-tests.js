import test from 'tape';
import compose from '../examples/compose';

export default (() => {

  const build = (num) => {

    const compose = {
      initializers: [num]
    };

    return { compose };
  }


  test(`initilazer 1`, (assert) => {
    const subject = compose(build(1), build(2));
    const initializers = subject.compose.initializers;

    const actual = initializers[0];
    const expected = 1;

    assert.equal(actual, expected,
      'should add initializer from first composable');

    assert.end();
  });

  test(`initilazer 2`, (assert) => {
    const subject = compose(build(1), build(2));
    const initializers = subject.compose.initializers;

    const actual = initializers[1];
    const expected = 2;

    assert.equal(actual, expected,
      'should add initializer from second composable');

    assert.end();
  });

  test(`initilazer 2`, (assert) => {
    const subject = compose(build(1), build(2), build(3));
    const initializers = subject.compose.initializers;

    const actual = initializers[2];
    const expected = 3;

    assert.equal(actual, expected,
      'should add initializer from subsequent composables');

    assert.end();
  });

}());
