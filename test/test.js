/**
 * Runs the compliance tests against the sample-implementation.js which is written in ES6.
 */
require('babel/register'); // Load ES6 runtime transplier
var compose = require('./sample-implementation').default; // get the implementation `compose`
require('./compliance-test')(compose); // Run the tests against that implementation
