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

export default defineConfig({
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    tsConfigPaths(),
    extractCssFontsPlugin(resolve(__dirname, 'src/fonts'))
  ],
  resolve: {
    alias: {
      'vaul/style.css?raw': resolve(__dirname, 'node_modules/vaul/style.css?raw')
    }
  },
  build: {
    cssMinify: 'esbuild',
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
