import test from 'tape';

test('Deep properties', nest => {
  nest.test('...should be cloned for descriptors', assert => {
    const deepInstance = { e: 'deep' };
    const stamp = compose({
      deepProperties: {
        obj: deepInstance
      }
    });
    const actual = stamp.compose.deepProperties.obj;

    assert.notEqual(actual, deepInstance,
      'deepProperties should not be assigned between descriptors');
    assert.end();
  });

  nest.test('...should be cloned for instances', assert => {
    const stamp = compose({
      deepProperties: {
        obj: { e: 'deep' }
      }
    });
    const notExpected = stamp.compose.deepProperties.obj;
    const actual = stamp().obj;

    assert.notEqual(actual, notExpected,
      'deepProperties should not be assigned from descriptor to object instance');
    assert.end();
  });
});

test('Deep static properties', nest => {
  nest.test('...should be cloned for descriptors', assert => {
    const deepInstance = { e: 'deep' };
    const stamp = compose({
      staticDeepProperties: {
        obj: deepInstance
      }
    });
    const actual = stamp.compose.staticDeepProperties.obj;

    assert.notEqual(actual, deepInstance,
      'staticDeepProperties should not be assigned between descriptors');
    assert.end();
  });

  nest.test('...should be cloned for new stamps', assert => {
    const stamp = compose({
      staticDeepProperties: {
        obj: { e: 'deep' }
      }
    });
    const notExpected = stamp.compose.staticDeepProperties.obj;
    const actual = stamp.obj;

    assert.notEqual(actual, notExpected,
      'staticDeepProperties should not be assigned from descriptor to stamp');
    assert.end();
  });
});
