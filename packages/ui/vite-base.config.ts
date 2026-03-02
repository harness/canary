import { createHash } from 'crypto'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { resolve, basename, extname, join } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsConfigPaths from 'vite-tsconfig-paths'

const external = [
  'react',
  'react-dom',
  'react-hook-form',
  'react-router-dom',
  'react-router',
  'react/jsx-runtime',
  'react-i18next',
  'i18next'
]

/**
 * Vite lib mode always inlines assets referenced via CSS url() as base64
 * data URIs (see https://github.com/vitejs/vite/issues/3295).
 *
 * The CSS file is emitted outside the Rollup bundle in lib mode, so
 * generateBundle cannot see it. This plugin uses writeBundle to post-process
 * the written CSS file on disk: it extracts base64-encoded font data URIs,
 * writes them as separate asset files, and rewrites the CSS references.
 */
function extractCssFontsPlugin(fontDir: string): Plugin {
  const FONT_DATA_URI_RE = /url\(data:(font\/(?:woff2?|ttf|otf|eot));base64,([A-Za-z0-9+/=]+)\)/g
  const MIME_TO_EXT: Record<string, string> = {
    'font/woff2': '.woff2',
    'font/woff': '.woff',
    'font/ttf': '.ttf',
    'font/otf': '.otf',
    'font/eot': '.eot'
  }

  return {
    name: 'extract-css-fonts',
    apply: 'build',
    writeBundle(options) {
      const outDir = options.dir || 'dist'

      const base64ToName = new Map<string, string>()
      try {
        for (const file of readdirSync(fontDir)) {
          const buf = readFileSync(resolve(fontDir, file))
          base64ToName.set(buf.toString('base64'), basename(file, extname(file)))
        }
      } catch {
        // fontDir missing — nothing to match against
      }

      const cssFiles = readdirSync(outDir).filter((f) => f.endsWith('.css'))

      for (const cssFile of cssFiles) {
        const cssPath = join(outDir, cssFile)
        let css = readFileSync(cssPath, 'utf-8')
        let idx = 0
        let changed = false

        css = css.replace(FONT_DATA_URI_RE, (_, mime: string, b64: string) => {
          changed = true
          const ext = MIME_TO_EXT[mime] || '.woff2'
          const name = base64ToName.get(b64) || `font-${idx++}`
          const assetFileName = `${name}${ext}`

          mkdirSync(join(outDir, 'assets'), { recursive: true })
          writeFileSync(join(outDir, 'assets', assetFileName), Buffer.from(b64, 'base64'))

          return `url(./assets/${assetFileName})`
        })

        if (changed) {
          writeFileSync(cssPath, css)
        }
      }
    }
  }
}

/**
 * Copies individual theme CSS files from core-design-system into dist/themes/
 * with content-hash filenames for long-lived caching. Generates a
 * theme-manifest.json that maps logical theme names to hashed filenames.
 */
function buildThemesPlugin(): Plugin {
  return {
    name: 'build-themes',
    apply: 'build',
    writeBundle(options) {
      const outDir = options.dir || 'dist'
      const themesDir = resolve(__dirname, 'src/styles/themes')
      const outThemesDir = join(outDir, 'themes')

      let themeFiles: string[]
      try {
        themeFiles = readdirSync(themesDir).filter(f => f.endsWith('.css'))
      } catch {
        return
      }

      if (themeFiles.length === 0) return

      mkdirSync(outThemesDir, { recursive: true })

      const manifest: Record<string, string> = {}

      for (const file of themeFiles) {
        const themeName = basename(file, '.css')
        const sourcePath = resolve(__dirname, '../core-design-system/dist/styles', `${themeName}.css`)
        const themeContent = readFileSync(sourcePath, 'utf-8')

        const hash = createHash('md5').update(themeContent).digest('hex').slice(0, 8)
        const hashedFilename = `${themeName}.${hash}.css`

        writeFileSync(join(outThemesDir, hashedFilename), themeContent)
        manifest[themeName] = hashedFilename
      }

      writeFileSync(join(outThemesDir, 'theme-manifest.json'), JSON.stringify(manifest, null, 2))

      const jsContent = `export const themeManifest = ${JSON.stringify(manifest, null, 2)};\n`
      writeFileSync(join(outThemesDir, 'theme-manifest.js'), jsContent)

      const dtsContent = `export declare const themeManifest: Record<string, string>;\n`
      writeFileSync(join(outThemesDir, 'theme-manifest.d.ts'), dtsContent)
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    tsConfigPaths(),
    extractCssFontsPlugin(resolve(__dirname, 'src/fonts')),
    buildThemesPlugin()
  ],
  resolve: {
    alias: {
      'vaul/style.css?raw': resolve(__dirname, 'node_modules/vaul/style.css?raw')
    }
  },
  build: {
    lib: {
      cssFileName: 'styles',
      entry: {
        components: resolve(__dirname, 'src/components/index.ts'),
        views: resolve(__dirname, 'src/views/index.ts'),
        utils: resolve(__dirname, 'src/utils/index.ts'),
        hooks: resolve(__dirname, 'src/hooks/index.ts'),
        locales: resolve(__dirname, 'locales/index.ts'),
        index: resolve(__dirname, 'src/index.ts'),
        context: resolve(__dirname, 'src/context/index.ts'),
        types: resolve(__dirname, 'src/types/index.ts'),
        'tailwind.config': resolve(__dirname, 'tailwind.config.ts'),
        'tailwind-design-system': resolve(__dirname, 'tailwind-design-system.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external
    },
    sourcemap: true
  }
})
