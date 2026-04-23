const config = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/vendor/**'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        // Match the Vite build: transpile only, no strict type-checking
        // at test time. Strict types live with the main `tsc` / build
        // path; jest is purely behavioral.
        isolatedModules: true,
        diagnostics: false,
        tsconfig: {
          jsx: 'react',
          esModuleInterop: true,
          isolatedModules: true,
          strict: false
        }
      }
    ]
  }
}

module.exports = config
