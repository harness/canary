import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import topLevelAwait from 'vite-plugin-top-level-await'

import { dependencies } from './package.json'

// https://vitejs.dev/config/repo-pipeline-list.tsx
export default defineConfig({
  plugins: [
    topLevelAwait(),
    federation({
      name: 'gitness',
      filename: 'remoteEntry.js',
      exposes: {
        './PipelineList': './src/pages/pipeline/repo-pipeline-list.tsx'
        // './PipelineList': './src/pages/signin.tsx'
      },
      // shared: ['react', 'react-dom']
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies.react
        }
      }
    }),
    react(),
    // @ts-expect-error: @TODO: Fix  this. Should be removed, added to enable typecheck
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ],
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: process.env.UI_HOST || '127.0.0.1',
    port: Number(process.env.UI_DEV_SERVER_PORT) || 5137,
    proxy: {
      '/api/v1': {
        /* https://stackoverflow.com/questions/70694187/vite-server-is-running-but-not-working-on-localhost */
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    assetsDir: '',
    target: 'esnext'
  }
})
