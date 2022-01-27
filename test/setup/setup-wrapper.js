/**
 * As there is a problem with ts paths in global jest setup we need to use this wrapper
 * See https://github.com/facebook/jest/issues/5164
 */

/* eslint-disable @typescript-eslint/no-var-requires */
require('tsconfig-paths/register');
require('ts-node/register/transpile-only');

module.exports = require('./setup').default;
