/** @type {import ('ts-jest').JestConfigWithTsJest;} */

// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  roots: ['<rootDir>/__tests__'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      expressApp: null,
    },
  },
  modulePathIgnorePatterns : ["node_modules"],
  coveragePathIgnorePatterns : ["node_modules", "<rootDir>/src/config/postgres/migrations", "<rootDir>/src/config/postgres/seeders"],
  setupFiles: ['./_init.test.ts'],
};