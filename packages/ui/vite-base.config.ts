import { createHash } from 'crypto'
import { mkdirSync, readdirSync, readFileSync, writeFileSync, type Dirent } from 'fs'
import { basename, extname, join, resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import dts from 'vite-plugin-dts'
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

      const cssFiles = readdirSync(outDir).filter(f => f.endsWith('.css'))

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
 * Rewrite non-ASCII characters as CSS escapes so theme CSS stays ASCII-only.
 * Trailing space terminates the escape so following hex digits are not absorbed.
 */
function toAsciiCss(css: string): string {
  return css.replace(/[^\x00-\x7F]/gu, ch => {
    const code = ch.codePointAt(0)!
    return `\\${code.toString(16)} `
  })
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
        // Escape non-ASCII (today: em-dashes in comments) so shipped theme CSS is ASCII-only.
        const themeContent = toAsciiCss(readFileSync(sourcePath, 'utf-8'))

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

/**
 * Fails the build if any emitted CSS file contains non-ASCII bytes.
 * Keeps shipped stylesheets encoding-agnostic so host apps that serve or
 * decode CSS as anything other than UTF-8 cannot show mojibake (e.g. â€‹
 * for a zero-width space in skeleton typography).
 */
function assertAsciiCssPlugin(): Plugin {
  const collectCssFiles = (dir: string): string[] => {
    let entries: Dirent[]
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return []
    }

    const files: string[] = []
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...collectCssFiles(fullPath))
      } else if (entry.isFile() && entry.name.endsWith('.css')) {
        files.push(fullPath)
      }
    }
    return files
  }

  return {
    name: 'assert-ascii-css',
    apply: 'build',
    writeBundle(options) {
      const outDir = options.dir || 'dist'
      const cssFiles = collectCssFiles(outDir)

      for (const cssPath of cssFiles) {
        const bytes = readFileSync(cssPath)
        for (let i = 0; i < bytes.length; i++) {
          const byte = bytes[i]
          if (byte > 0x7f) {
            const start = Math.max(0, i - 40)
            const end = Math.min(bytes.length, i + 40)
            const context = bytes.subarray(start, end).toString('latin1')
            throw new Error(
              `[assert-ascii-css] Non-ASCII byte 0x${byte.toString(16)} at offset ${i} in ${cssPath}. ` +
                `Context: ${JSON.stringify(context)}. ` +
                `Ensure CSS uses escapes (e.g. "\\200B") and esbuild.charset is "ascii".`
            )
          }
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
    dts({ rollupTypes: true }),
    extractCssFontsPlugin(resolve(__dirname, 'src/fonts')),
    buildThemesPlugin(),
    // Runs after CSS is written so it sees the final on-disk contents.
    assertAsciiCssPlugin()
  ],
  // Vite's CSS minifier reads config.esbuild.charset and defaults to "utf8", which turns
  // CSS escapes like "\200B" back into raw non-ASCII bytes. Force ASCII so dist CSS is
  // encoding-agnostic (host apps that serve/decode CSS as non-UTF-8 otherwise show mojibake).
  esbuild: { charset: 'ascii' },
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
        utils: resolve(__dirname, 'src/utils/index.ts'),
        hooks: resolve(__dirname, 'src/hooks/index.ts'),
        locales: resolve(__dirname, 'locales/index.ts'),
        index: resolve(__dirname, 'src/index.ts'),
        context: resolve(__dirname, 'src/context/index.ts'),
        types: resolve(__dirname, 'src/types/index.ts'),
        'tailwind.config': resolve(__dirname, 'tailwind.config.ts'),
        'tailwind-design-system': resolve(__dirname, 'tailwind-design-system.ts'),
        'yaml-output': resolve(__dirname, 'src/components/yaml-output/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external
    },
    sourcemap: true
  }
})
