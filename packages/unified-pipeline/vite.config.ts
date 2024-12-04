import path, { resolve } from 'path'

import ViteYaml from '@modyfi/vite-plugin-yaml'
import react from '@vitejs/plugin-react-swc'
import { uniq } from 'lodash-es'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

const pkg = require('./package.json')

const external = uniq(
  Object.keys(pkg.dependencies || [])
    .concat(Object.keys(pkg.devDependencies || []))
    .concat(Object.keys(pkg.peerDependencies || []))
    .concat(['elkjs', 'web-worker'])
)

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json'
      // beforeWriteFile: (filePath, content) => ({
      //   filePath: filePath.replace('src/', ''),
      //   content
      // })
    }),
    svgr(),
    ViteYaml()
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'unified-pipeline',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: { external }
  }
})
