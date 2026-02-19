import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // @ts-expect-error: @TODO: Fix  this. Should be removed, added to enable typecheck
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ],
  server: {
    host: process.env.UI_HOST || '127.0.0.1',
    port: Number(process.env.UI_DEV_SERVER_PORT) || 5137,
    proxy: {
      '/api/v1': {
        /* https://stackoverflow.com/questions/70694187/vite-server-is-running-but-not-working-on-localhost */
        target: 'http://127.0.0.1:3000',
        changeOrigin: false,  // Keep origin as 127.0.0.1:5137 for cookies
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Forward cookies from the original request
            if (req.headers.cookie) {
              proxyReq.setHeader('cookie', req.headers.cookie)
            }
          })
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            // Rewrite Set-Cookie headers to work with the proxy
            const setCookieHeaders = proxyRes.headers['set-cookie']
            if (setCookieHeaders) {
              proxyRes.headers['set-cookie'] = setCookieHeaders.map((cookie: string) => {
                // Remove domain restriction and set path to / for all cookies
                return cookie
                  .replace(/Domain=[^;]+;?\s*/gi, '')
                  .replace(/Path=[^;]+/gi, 'Path=/')
                  .replace(/Secure;?\s*/gi, '')  // Remove Secure flag for localhost
                  .replace(/SameSite=[^;]+/gi, 'SameSite=Lax')
              })
            }
          })
        }
      }
    }
  },
  build: {
    assetsDir: ''
  }
})
