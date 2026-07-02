import { resolve } from 'path'

import { mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(viteConfig, {
  test: {
    environment: 'jsdom',
    setupFiles: ['./config/vitest-setup.ts'],
    globals: true,
    css: {
      // Disable CSS processing - we don't need styles in tests
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
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
    alias: [
      // Mock monaco-editor and monaco-yaml for tests - they don't work well in jsdom and aren't needed for component tests.
      // Use regex pattern to catch all monaco-editor imports including subpaths, and absolute path so the alias
      // works even when resolving from transitive dependencies (e.g. @harnessio/yaml-editor).
      {
        find: /^monaco-editor/,
        replacement: resolve(__dirname, 'config/mocks/monaco-editor.ts')
      },
      {
        find: /^monaco-yaml/,
        replacement: resolve(__dirname, 'config/mocks/monaco-yaml.ts')
      }
    ]
  }
})
