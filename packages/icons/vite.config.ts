import { readdirSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, join } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'

const SVG_DTS_CONTENT = `import { FunctionComponent, SVGProps } from 'react';
declare const Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
export default Icon;
`

function generateIconDts(): Plugin {
  return {
    name: 'generate-icon-dts',
    apply: 'build',
    writeBundle(options) {
      const outDir = options.dir || 'dist'
      const iconsOutDir = join(outDir, 'icons')
      const srcIconsDir = resolve(__dirname, 'src/icons')

      mkdirSync(iconsOutDir, { recursive: true })

      const svgFiles = readdirSync(srcIconsDir).filter(f => f.endsWith('.svg'))
      for (const file of svgFiles) {
        writeFileSync(join(iconsOutDir, `${file}.d.ts`), SVG_DTS_CONTENT)
      }

      // Generate index.d.ts that re-exports from per-icon .d.ts files
      const indexDtsLines = svgFiles
        .sort()
        .map(file => {
          const name = file.replace(/\.svg$/, '')
          const componentName = toComponentName(file)
          return `export { default as ${componentName} } from './icons/${file}';`
        })

      writeFileSync(
        join(outDir, 'index.d.ts'),
        indexDtsLines.join('\n') + '\n'
      )

      // Generate types.d.ts
      const typeLines = svgFiles.sort().map((file, i) => {
        const key = file.replace(/\.svg$/, '')
        const sep = i === 0 ? '  ' : '| '
        return `  ${sep}'${key}'`
      })
      writeFileSync(
        join(outDir, 'types.d.ts'),
        `export type IconName =\n${typeLines.join('\n')};\n`
      )
    }
  }
}

function toComponentName(filename: string): string {
  const RESERVED_WORDS = new Set([
    'Import', 'Export', 'Delete', 'Default', 'Switch',
    'Class', 'Function', 'Return', 'New', 'Void', 'Null'
  ])
  const name = filename
    .replace(/\.svg$/, '')
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
  return RESERVED_WORDS.has(name) ? `${name}Icon` : name
}

export default defineConfig({
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    generateIconDts()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js'
      }
    },
    sourcemap: true,
    minify: false
  }
})
