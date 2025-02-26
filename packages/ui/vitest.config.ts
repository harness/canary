import { mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(viteConfig, {
  test: {
    environment: 'jsdom',
    setupFiles: ['./config/vitest-setup.ts'],
    globals: true,
    coverage: {
      provider: 'istanbul',
      include: ['src'],
      exclude: [
        'src/index.ts',
        'src/components/index.ts',
        'src/views/index.ts',
        'src/hooks/index.ts',
        'src/locales/index.ts',
        'src/**/*.test.*',
        'src/utils/cn.ts'
      ],
      extension: ['ts', 'js', 'tsx', 'jsx']
      // thresholds: {
      //   branches: 80,
      //   lines: 80,
      //   functions: 80,
      //   statements: 80
      // }
    },
    server: {
      deps: {
        inline: [/react/]
      }
    }
  },
  resolve: {
    alias: {
      // monaco editor doesn't have a proper ESM export marked up in their
      // package file, so we need to resolve it manually
      'monaco-editor': './config/resolve-monaco'
    }
  }
})
