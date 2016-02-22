import test from 'tape';
import _ from 'lodash';
import compose from '../examples/compose';

test('compose ignores non objects', assert => {
  const stamp = compose(0, 'a', null, undefined, {}, NaN, /regexp/);
  const subject = _.values(stamp.compose).filter(_.negate(_.isEmpty)).length;
  const expected = 0;

  assert.equal(subject, expected,
    'should not add any descriptor data');

  assert.end();
});

test('compose in order', assert => {
  const initOrder = [];
  const getInitDescriptor = (value) => {
    return {initializers: [() => initOrder.push(value)]};
  };

  const stamp = compose(
    compose(getInitDescriptor(0)),
    compose(getInitDescriptor(1), getInitDescriptor(2))
      .compose(getInitDescriptor(3), getInitDescriptor(4)),
    getInitDescriptor(5)
  );
  stamp();
  const expected = [0, 1, 2, 3, 4, 5];

  assert.deepEqual(initOrder, expected,
    'should compose in proper order');

  assert.end();
});

test('compose is detachable', assert => {
  const detachedCompose = compose().compose;

  assert.notEqual(compose, detachedCompose,
    'stamp .compose function must be a different object to "compose"');

  assert.end();
});

test('detached compose does not inherit previous descriptor', assert => {
  const detachedCompose = compose({properties: {foo: 1}}).compose;
  const obj = detachedCompose()();
  const expected = undefined;

  assert.equal(obj.foo, expected,
    'detached compose method should not inherit parent descriptor data');

  assert.end();
});

test('compose is replaceable', assert => {
  let counter = 0;
  function newCompose() {
    counter++;
    return compose({staticProperties: {compose: newCompose}}, this, arguments);
  }
  newCompose().compose().compose();
  const expected = 3;

  assert.equal(counter, expected,
    'should inherit new compose function');

  assert.end();
});
