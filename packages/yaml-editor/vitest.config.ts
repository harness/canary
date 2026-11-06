import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./config/vitest-setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      include: ['src'],
      exclude: ['src/index.ts', 'src/global.d.ts', 'src/types/**', 'src/**/*.test.*'],
      extension: ['ts', 'tsx']
    },
    server: {
      deps: {
        // Inline react so @testing-library/react (React 17) resolves a single react instance.
        inline: [/react/]
      }
    }
  },
  resolve: {
    alias: [
      // Monaco doesn't load in jsdom and isn't needed for these tests; alias to lightweight mocks.
      // Absolute paths so the alias also catches monaco-editor subpath imports (e.g. from monaco-globals).
      {
        find: /^monaco-editor$/,
        replacement: resolve(__dirname, 'config/mocks/monaco-editor.ts')
      },
      {
        find: /^monaco-editor\//,
        replacement: resolve(__dirname, 'config/mocks/monaco-editor.ts')
      },
      {
        find: /^monaco-yaml/,
        replacement: resolve(__dirname, 'config/mocks/monaco-yaml.ts')
      },
      {
        find: /^@monaco-editor\/react/,
        replacement: resolve(__dirname, 'config/mocks/monaco-editor-react.tsx')
      }
    ]
  }
})
