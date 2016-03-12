import test from 'tape';

test('compose function', assert => {
  const actual = typeof compose;
  const expected = 'function';

  assert.equal(actual, expected,
    'compose should be a function.');

  assert.end();
});

test('compose.staticProperties', nest => {
  ['staticProperties', 'staticDeepProperties'].forEach(descriptorName => {

    nest.test(`...for descriptor with ${descriptorName}`, assert => {
      const actual = compose({
        [ descriptorName ]: {
          a: 'a'
        }
      }, {
        [ descriptorName ]: {
          b: 'b'
        }
      }).compose[ descriptorName ];

      const expected = {
        a: 'a',
        b: 'b'
      };

      assert.deepEqual(actual, expected,
        `should compose ${ descriptorName } into descriptor`);

      assert.end();
    });

    nest.test(`...for stamp with ${descriptorName}`, assert => {
      const stamp = compose({
        [ descriptorName ]: {
          a: 'a'
        }
      }, {
        [ descriptorName ]: {
          b: 'b'
        }
      });

      const actual = Object.assign({}, {
        a: stamp.a,
        b: stamp.b
      });

      const expected = {
        a: 'a',
        b: 'b'
      };

      assert.deepEqual(actual, expected,
        `should add ${ descriptorName } to stamp`);

      assert.end();
    });

  });
});
