import { createRequire } from 'node:module'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import tsConfigPaths from 'vite-tsconfig-paths'

const require = createRequire(import.meta.url)

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // framer-motion (a @harnessio/ui dep) optionally imports this; pin it to a
      // concrete path so Vite's dep scan resolves it regardless of pnpm hoisting.
      '@emotion/is-prop-valid': require.resolve('@emotion/is-prop-valid')
    }
  },
  plugins: [
    react(),
    tsConfigPaths(),
    // @ts-expect-error: @TODO: Fix  this. Should be removed, added to enable typecheck
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ]
})
