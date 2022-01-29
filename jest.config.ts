import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.test.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@decorators/(.*)$': '<rootDir>/src/common/decorators/$1',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@entities/(.*)$': '<rootDir>/src/db/entities/$1',
    '^@repositories/(.*)$': '<rootDir>/src/db/repositories/$1',
    '^@vehicles/(.*)$': '<rootDir>/src/vehicles/$1',
    '^@bookings/(.*)$': '<rootDir>/src/bookings/$1',
    '^@transformers/(.*)$': '<rootDir>/src/db/transformers/$1',
  },
  globalSetup: '<rootDir>/test/setup/setup-wrapper.js',
  globalTeardown: '<rootDir>/test/setup/teardown-wrapper.js',
};

export default config;
