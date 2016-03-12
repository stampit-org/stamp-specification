import test from 'tape';

test('comopose function pojo (Plain Old JavaScript Object)', nest => {
  const objDescriptors = [
    'properties',
    'deepProperties',
    'staticProperties',
    'staticDeepProperties',
    'propertyDescriptors',
    'staticPropertyDescriptors',
    'configuration'
  ];

  objDescriptors.forEach(descriptorName => {
    nest.test(`...with pojo descriptor.${ descriptorName }`, assert => {
      const descriptor = {
        [ descriptorName ]: {
          a: {
            b: 'b'
          }
        }
      };

      const actual = compose(descriptor).compose[descriptorName].a;
      const expected = {b: 'b'};

      assert.deepEqual(actual, expected,
        `should create ${ descriptorName } descriptor`);

      assert.end();
    });
  });

});

test('compose function pojo', nest => {

  nest.test('...with pojo descriptor.methods', assert => {
    const a = function a() {
      return 'a';
    };

    const actual = Object.getPrototypeOf(compose({
      methods: {a}
    })());

    const expected = {a};

    assert.deepEqual(actual, expected,
      'should create methods descriptor');

    assert.end();
  });

  nest.test('...with pojo descriptor.initializers', assert => {
    const a = function a() {
      return 'a';
    };

    const actual = compose({
      initializers: [a]
    }).compose.initializers;

    const expected = [a];

    assert.deepEqual(actual, expected,
      'should create initializers descriptor');

    assert.end();
  });
});
