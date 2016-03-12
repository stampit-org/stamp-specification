#!/usr/bin/env node
(function () {
  var path = require('path');
  var composeImplementationFile = process.argv[2];
  if (!composeImplementationFile) {
    console.log('usage: ' + path.basename(process.argv[1]) + ' COMPOSE_FILE_NAME');
    return;
  }

  composeImplementationFile = path.join(process.cwd(), composeImplementationFile);
  var imported;
  try {
    require('babel-register');
    require('babel-polyfill');

    imported = require(composeImplementationFile);
  } catch (err) {
    console.error('Failed to read JavaScript file ' + composeImplementationFile);
    console.error(err);
    return;
  }

  var compose = typeof imported === 'function' ? imported :
    typeof imported.default === 'function' ? imported.default :
      typeof imported.compose === 'function' ? imported.compose :
        undefined;
  if (!compose) {
    console.error('The file ' + composeImplementationFile + ' should export the "compose" function.');
    return;
  }

  global.compose = compose;
  require('../test/run-all');
}());
