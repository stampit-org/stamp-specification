import test from 'tape';
import _ from 'lodash';
import compose from '../examples/compose';

test('compose ignores non objects', assert => {
  const stamp = compose(0, 'a', null, undefined, {}, NaN, /regexp/);
  const subject = _.values(stamp.compose).filter(value => !_.isEmpty(value)).length;
  const expected = 0;

  assert.equal(subject, expected,
    'should not add any descriptor data');

  assert.end();
});
