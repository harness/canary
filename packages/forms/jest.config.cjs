const config = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/vendor/**'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
    }]
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
}

module.exports = config

