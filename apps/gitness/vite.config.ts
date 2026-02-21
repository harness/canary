import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, Plugin } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// Get absolute paths to workspace packages
const workspaceRoot = resolve(__dirname, '../..')
const uiDist = resolve(workspaceRoot, 'packages/ui/dist')
const viewsDist = resolve(workspaceRoot, 'packages/views/dist')
const filtersDist = resolve(workspaceRoot, 'packages/filters/dist')

/**
 * Custom plugin to force ALL workspace package imports to resolve to absolute paths.
 * This ensures the same module instance is used by both gitness and views packages,
 * preventing React context duplication issues.
 */
function workspaceDedupePlugin(): Plugin {
  const packagePaths: Record<string, string> = {
    // UI package subpaths
    '@harnessio/ui/components': resolve(uiDist, 'components.js'),
    '@harnessio/ui/context': resolve(uiDist, 'context.js'),
    '@harnessio/ui/hooks': resolve(uiDist, 'hooks.js'),
    '@harnessio/ui/utils': resolve(uiDist, 'utils.js'),
    '@harnessio/ui/types': resolve(uiDist, 'types.js'),
    '@harnessio/ui/locales': resolve(uiDist, 'locales.js'),
    // Other workspace packages
    '@harnessio/views': resolve(viewsDist, 'index.js'),
    '@harnessio/filters': resolve(filtersDist, 'index.js')
  }

  return {
    name: 'workspace-dedupe',
    enforce: 'pre',
    resolveId(source) {
      if (packagePaths[source]) {
        return packagePaths[source]
      }
      return null
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    workspaceDedupePlugin(),
    react(),
    // @ts-expect-error: @TODO: Fix  this. Should be removed, added to enable typecheck
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },
  optimizeDeps: {
    // Exclude workspace packages from pre-bundling - serve them directly
    exclude: ['@harnessio/views', '@harnessio/ui', '@harnessio/filters']
  },
  server: {
    host: process.env.UI_HOST || '127.0.0.1',
    port: Number(process.env.UI_DEV_SERVER_PORT) || 5137,
    proxy: {
      '/api/v1': {
        /* https://stackoverflow.com/questions/70694187/vite-server-is-running-but-not-working-on-localhost */
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    },
    fs: {
      allow: [workspaceRoot]
    }
  },
  build: {
    assetsDir: ''
  }
})
