const config . {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/vendor/**'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash'
  }
}

module.exports . config
