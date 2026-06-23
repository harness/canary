// Shoot a /view-preview subject AND report a render-health verdict in one load.
// Superset of shoot-prototype.mjs: same theme-aware capture, plus error-overlay
// detection, uncaught page errors, console errors, and rendered-element metrics —
// because verify_against_manifest.py is blind to icon/illustration names (large
// enums are count-only), so a bad name passes verify and renders blank with no
// crash. Size alone won't catch that; element/text metrics + overlay do.
//
// Usage: node scripts/shoot-check.mjs <slug> <out.png> [theme] [width] [height]
// Prints one JSON line to stdout: { slug, theme, out, bytes, errorOverlay,
//   pageErrors, consoleErrors, elements, bodyTextLen }
import pkg from '/Users/jared/code/canary-manifest/node_modules/.pnpm/playwright-core@1.55.0/node_modules/playwright-core/index.js'
import { statSync } from 'node:fs'
const { chromium } = pkg

const [, , slug, out, theme = 'dark-std-std', w = '1440', h = '1080'] = process.argv
const exec =
  '/Users/jared/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

const browser = await chromium.launch({ executablePath: exec })
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 2
})
await ctx.addInitScript(t => {
  try {
    sessionStorage.setItem('view-preview-theme', t)
  } catch {}
}, theme)

const pageErrors = []
const consoleErrors = []
const page = await ctx.newPage()
page.on('pageerror', e => pageErrors.push(String(e && e.message ? e.message : e)))
page.on('console', m => {
  if (m.type() === 'error') consoleErrors.push(m.text())
})

const url = `http://localhost:5173/view-preview/${slug}`
let navError = null
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
} catch (e) {
  navError = String(e && e.message ? e.message : e)
}
await page.waitForTimeout(900)

// Vite shows runtime/import errors in a <vite-error-overlay> custom element.
const errorOverlay = await page
  .locator('vite-error-overlay')
  .count()
  .catch(() => -1)

const metrics = await page
  .evaluate(() => ({
    elements: document.querySelectorAll('*').length,
    bodyTextLen: (document.body && document.body.innerText
      ? document.body.innerText.length
      : 0)
  }))
  .catch(() => ({ elements: -1, bodyTextLen: -1 }))

await page.screenshot({ path: out, fullPage: true })
await browser.close()

let bytes = -1
try {
  bytes = statSync(out).size
} catch {}

console.log(
  JSON.stringify({
    slug,
    theme,
    out,
    bytes,
    errorOverlay,
    pageErrors,
    consoleErrors: consoleErrors.slice(0, 5),
    consoleErrorCount: consoleErrors.length,
    elements: metrics.elements,
    bodyTextLen: metrics.bodyTextLen,
    navError
  })
)
