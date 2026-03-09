import { resolve } from 'path'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

const appNodeModules = resolve(__dirname, 'node_modules')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Force all react imports to resolve to the same instance in the app's node_modules
      'react': resolve(appNodeModules, 'react'),
      'react-dom': resolve(appNodeModules, 'react-dom'),
      'react/jsx-runtime': resolve(appNodeModules, 'react/jsx-runtime.js'),
      'react/jsx-dev-runtime': resolve(appNodeModules, 'react/jsx-dev-runtime.js'),
      // Mock monaco-editor with an empty module for tests
      'monaco-editor': resolve(__dirname, 'config/mocks/monaco-editor.ts'),
      // Mock workspace packages for tests
      '@harnessio/views': resolve(__dirname, 'config/mocks/harnessio-views.ts'),
      '@harnessio/ui/components': resolve(__dirname, 'config/mocks/harnessio-ui-components.ts')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./config/vitest-setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    globals: true,
    coverage: {
      provider: 'istanbul',
      include: ['src'],
      exclude: ['src/main.tsx', 'src/App.tsx', 'src/**/*.test.*'],
      extension: ['ts', 'js', 'tsx', 'jsx']
    }
  }
})
