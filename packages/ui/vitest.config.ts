import { mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(viteConfig, {
  test: {
    deps: {
      inline: [
        /@radix-ui\/react-dialog/,
        /@radix-ui\/react-slot/,
        /@radix-ui\/react-context/,
        /@radix-ui\/react-dismissable-layer/,
        /@radix-ui\/react-primitive/,
        /@radix-ui\/react-focus-scope/,
        /@radix-ui\/react-portal/
      ]
    },
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
    }
  }
})
