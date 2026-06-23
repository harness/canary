// Capture a rendered /design-prototype subject from the running Vite dev server.
// Usage: node scripts/shoot-prototype.mjs <slug> <out.png> [theme] [width] [height]
//   theme: a Themes enum value, e.g. light-std-std | dark-std-std (default dark-std-std)
import pkg from '/Users/jared/code/canary-manifest/node_modules/.pnpm/playwright-core@1.55.0/node_modules/playwright-core/index.js'
const { chromium } = pkg

const [, , slug, out, theme = 'dark-std-std', w = '1440', h = '1080'] = process.argv
const exec =
  '/Users/jared/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

const browser = await chromium.launch({ executablePath: exec })
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 2
})
// Seed the theme the view-preview app reads on mount.
await ctx.addInitScript(t => {
  try {
    sessionStorage.setItem('view-preview-theme', t)
  } catch {}
}, theme)
const page = await ctx.newPage()
const url = `http://localhost:5173/view-preview/${slug}`
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(900)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log('shot:', out, '<-', url, '| theme:', theme)
