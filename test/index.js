require('babel-register');
require('babel-polyfill');

var compose = require('../examples/compose').default;
global.compose = compose;

require('./run-all');
