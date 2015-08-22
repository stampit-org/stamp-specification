/**
 * DISCLAIMER
 *
 * This is a set of test which check any stamp implementation to be compliant to the standard.
 *
 * Written as ES5 to run in a broad number of environments.
 * Requires `tape` and `lodash` CommonJS modules. Requires global variable `compose`.
 *
 * Run in with:
 * $ npm test
 */

module.exports = function (compose) {

  var test = require('tape');
  var _ = require('lodash');

  function isComposable(obj) {
    return _.isFunction(obj) && _.isFunction(obj.compose);
  }

  function isDescriptor(obj) {
    return _.isObject(obj);
  }


  test('basic types', t => {
    t.ok(_.isFunction(compose), 'compose() function type');
    t.ok(_.isFunction(compose()), 'stamp instance type');
    t.ok(isComposable(compose()), 'stamp is a composable');
    t.ok(_.isFunction(compose().compose), 'stamp.compose type');
    t.ok(isDescriptor(compose().compose), 'stamp.compose is a descriptor');
    t.end();
  });

  test('basic composition', t => {
    const aStamp = compose();
    const stamp1 = compose();
    const stamp2 = compose();
    t.ok(isComposable(compose(aStamp)), 'compose a stamp from a composable');
    t.ok(isComposable(compose(stamp1, stamp2)), "compose a stamp from multiple composables");
    t.ok(isComposable(compose(aStamp.compose)), 'compose a stamp from a descriptor');
    t.ok(isComposable(compose(stamp1.compose, stamp2.compose)), 'compose a stamp from multiple descriptors');
    t.ok(isComposable(aStamp.compose(stamp1)), 'compose a stamp using stamp.compose');
    t.ok(isComposable(aStamp.compose(stamp1, stamp2)), 'compose a stamp using stamp.compose, multiple stamps');
    t.ok(isComposable(aStamp.compose(stamp1.compose)), 'compose a stamp using stamp.compose from a descriptors');
    t.ok(isComposable(aStamp.compose(stamp1.compose, stamp2.compose)),
      'compose a stamp using stamp.compose from multiple descriptors');
    t.end();
  });

  test('basic object instantiation', t => {
    const aStamp = compose();
    t.ok(_.isPlainObject(aStamp()), 'create an object instance');
    t.ok(aStamp(42) === 42, 'pass through a value');
    t.end();
  });


  /**
   * Descriptor
   */

  test('descriptor have standard properties', t => {
    const descriptor = compose().compose;
    // TODO
    t.end();
  });

}