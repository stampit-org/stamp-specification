import test from 'tape';
import compose from '../examples/compose';
import assignmentTests from './assignment-tests';
import mergeTests from './merge-tests';

test('compose function', (assert) => {
  const actual = typeof compose;
  const expected = 'function';

  assert.equal(actual, expected,
    'compose should be a function.');

  assert.end();
});

test('compose.methods', (assert) => {
  const actual = !!compose().compose.methods;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.methods');

  assert.end();
});


test('compose.properties', (assert) => {
  const actual = !!compose().compose.properties;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.properties');

  assert.end();
});


test('compose.deepProperties', (assert) => {
  const actual = !!compose().compose.deepProperties;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.deepProperties');

  assert.end();
});


test('compose.initializers', (assert) => {
  const actual = !!compose().compose.initializers;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.initializers');

  assert.end();
});


test('compose.staticProperties', (assert) => {
  const actual = !!compose().compose.staticProperties;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.staticProperties');

  assert.end();
});


test('compose.propertyDescriptors', (assert) => {
  const actual = !!compose().compose.propertyDescriptors;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.propertyDescriptors');

  assert.end();
});


test('compose.staticPropertyDescriptors', (assert) => {
  const actual = !!compose().compose.staticPropertyDescriptors;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.staticPropertyDescriptors');

  assert.end();
});


test('compose.configuration', (assert) => {
  const actual = !!compose().compose.configuration;
  const expected = true;

  assert.equal(actual, expected,
    'should create compose.configuration');

  assert.end();
});


// stamp instances
/*
'properties.a should exist'
'properties.b should exist'
'properties.overridden should exist'
'staticProperties.a should exist'
'staticProperties.b should exist'
'staticProperties.overridden should exist'
*/
