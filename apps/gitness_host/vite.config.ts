import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'

import { dependencies } from './package.json'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    topLevelAwait(),
    federation({
      name: 'gitness-host',
      remotes: {
        gitness: {
          type: 'module',
          name: 'gitness',
          entry: 'http://localhost:5137/remoteEntry.js',
          entryGlobalName: 'gitness',
          shareScope: 'default'
        }
      },
      // shared: ['react', 'react-dom']
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '18.3.1'
          // shareScope: 'default'
        }
      }
    }),
    react()
  ],
  server: {
    port: 5566
  }
})
