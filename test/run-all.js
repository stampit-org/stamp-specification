if (typeof global.compose !== 'function') {
  throw new Error('Global variable "compose" was not found. Aborting tests.');
} else {
  var requireAll = require('require-all');

  requireAll({
    dirname: __dirname,
    filter: /.+-tests\.js$/
  });
}
