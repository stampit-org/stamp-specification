import test from 'tape';
import compose from '../examples/compose';

test('compose collision warnings', nest => {
  nest.test('...same stamp, different descriptor', assert => {
    let actual = 0;
    const expected = 4;

    const config = compose({
      configuration: {
        warnOnCollision: true,
        logger () {
          actual += 1;
        }
      }
    });

    compose(config, {
      properties: {
        a: 'props'
      },
      deepProperties: {
        a: 'deep props'
      },
      propertyDescriptors: {
        a: {
          value: 'prop descriptors',
          writable: false
        }
      },
      staticProperties: {
        a: 'static props'
      },
      deepStaticProperties: {
        a: 'deep static props'
      },
      staticPropertyDescriptors: {
        a: {
          value: 'static prop descriptors',
          writable: false
        }
      }
    })();

    assert.equal(actual, expected,
      'should warn on cross-descriptor collisions from the same stamp');

    assert.end();
  });

  nest.test('...different stamp, different descriptor', assert => {
    let actual = 0;
    const expected = 4;

    const config = compose({
      configuration: {
        warnOnCollision: true,
        logger () {
          actual += 1;
        }
      }
    });

    compose(config, {
      properties: {
        a: 'props'
      },
      staticProperties: {
        a: 'static props'
      }
    },
    {
      deepProperties: {
        a: 'deep props'
      },
      propertyDescriptors: {
        a: {
          value: 'prop descriptors',
          writable: false
        }
      },
      deepStaticProperties: {
        a: 'deep static props'
      },
      staticPropertyDescriptors: {
        a: {
          value: 'static prop descriptors',
          writable: false
        }
      }
    })();

    assert.equal(actual, expected,
      'should warn on cross-descriptor collisions from a different stamp');

    assert.end();
  });
});
