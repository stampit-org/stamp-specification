import test from 'tape';
import compose from '../examples/compose';

export default (() => {

  const buildA = () => ({
    compose: {
      methods: {
        a: () => { return 'a'; },
        override: () => { return 'a'; }
      }
    }
  });

  const buildB = () => ({
    compose: {
      methods: {
        b: () => { return 'b'; },
        override: () => { return 'b'; }
      }
    }
  });

  test('method assignment a', (assert) => {
    const subject = compose(buildA(), buildB());
    const methods = subject.compose.methods;

    const actual = typeof methods.a;

    const expected = 'function';

    assert.equal(actual, expected,
      'methods should be copied by assignment from first argument');

    assert.end();
  });

  test('method assignment b', (assert) => {
    const subject = compose(buildA(), buildB());
    const methods = subject.compose.methods;

    const actual = typeof methods.b;

    const expected = 'function';

    assert.equal(actual, expected,
      'methods should be copied by assignment from subsequent arguments');

    assert.end();
  });

  test('method assignment', (assert) => {
    const subject = compose(buildA(), buildB());
    const methods = subject.compose.methods;

    const actual = methods.override();

    const expected = 'b';

    assert.equal(actual, expected,
      'methods should be copied by assignment with last-in priority');

    assert.end();
  });

}());
