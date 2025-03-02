'use strict';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  setupFiles: ['dotenv/config'],
  verbose: true,
  collectCoverage: false,
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageReporters: ['json', 'html', 'lcov', 'cobertura', 'text-summary'],
  watchman: false,
};
