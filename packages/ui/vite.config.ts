import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'
import tsConfigPaths from 'vite-tsconfig-paths'

const external = ['react', 'react-hook-form']

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true }), svgr({ include: '**/*.svg' }), tsConfigPaths()],
  build: {
    lib: {
      entry: {
        components: resolve(__dirname, 'src/components/index.ts'),
        views: resolve(__dirname, 'src/views/index.ts'),
        index: resolve(__dirname, 'src/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: external
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./config/vitest-setup.ts'],
    globals: true,
    coverage: {
      provider: 'istanbul',
      include: ['src'],
      exclude: ['src/index.ts', 'src/components/index.ts', 'src/views/index.ts', 'src/**/*.test.*', 'src/utils/cn.ts'],
      extension: ['ts', 'js', 'tsx', 'jsx']
      // thresholds: {
      //   branches: 80,
      //   lines: 80,
      //   functions: 80,
      //   statements: 80
      // }
    }
  }
})
