import fs from 'node:fs'
import path from 'path'

import * as esbuild from 'esbuild'
import svgrPlugin from 'esbuild-plugin-svgr'
import tsconfigPaths from 'esbuild-plugin-tsconfig-paths'

// import { tsconfigPathsPlugin } from 'esbuild-plugin-tsconfig-paths/lib/plugin'

console.log('tsconfigPaths', tsconfigPaths.tsconfigPathsPlugin())

// import { replaceTscAliasPaths } from 'tsc-alias'

// import 'node:path'

const external = [
  'react',
  'react-hook-form',
  'react-router-dom',
  'react-router',
  'react/jsx-runtime',
  'react-i18next',
  'i18next'
]

await esbuild
  .build({
    entryPoints: {
      components: path.resolve('src/components/index.ts'),
      views: path.resolve('src/views/index.ts'),
      utils: path.resolve('src/utils/index.ts'),
      hooks: path.resolve('src/hooks/index.ts'),
      locales: path.resolve('locales/index.ts'),
      index: path.resolve('src/index.ts'),
      context: path.resolve('src/context/index.ts'),
      types: path.resolve('src/types/index.ts'),
      'tailwind.config': path.resolve('tailwind.config.js')
    },
    bundle: true,
    format: 'esm',
    sourcemap: true,
    loader: {
      '.woff2': 'file',
      '.ttf': 'file',
      '.png': 'file'
    },
    external,
    plugins: [
      svgrPlugin({
        svgoConfig: {
          plugins: [
            {
              name: 'removeAttrs',
              params: {
                attrs: 'stopColor'
              }
            }
          ]
        }
      }),
      tsconfigPaths.tsconfigPathsPlugin()
    ],
    outdir: 'dist'
  })
  .catch(() => process.exit(1))

// await replaceTscAliasPaths({
//   configFile: 'tsconfig.json',
//   watch: false,
//   outDir: 'dist',
//   declarationDir: 'dist'
// })

// fs.copyFileSync(path.resolve('lib', 'global.css'), path.resolve('dist', 'global.css'))
