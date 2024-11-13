import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import path, { resolve } from 'path'
import svgr from 'vite-plugin-svgr'

const external = ['react', 'react-dom', 'lodash-es', '@harnessio/icons-noir', 'react-hook-form']

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.app.json',
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace('src/', ''),
        content
      })
    }),
    svgr({
      include: '**/*.svg'
    })
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views')
    }
  },
  build: {
    lib: {
      entry: {
        components: resolve(__dirname, 'src/components/index.ts'),
        views: resolve(__dirname, 'src/views/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: external
    }
  }
})
