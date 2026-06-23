// Render-loop capture step: load a view-preview route, wait for the
// @harnessio/ui render, record console errors, and save a screenshot.
// Usage: node scripts/shoot-prototype.mjs <route> <out.png>
import { chromium } from '@playwright/test'

const route = process.argv[2] || 'empty-repo'
const out = process.argv[3] || '/tmp/prototype.png'
const url = `http://localhost:5173/view-preview/${route}`

// The installed Playwright build doesn't match the cached browser revision;
// point at the concrete Chrome-for-Testing binary present on disk.
const executablePath = process.env.PW_CHROME || undefined
const browser = await chromium.launch(executablePath ? { executablePath } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('console', m => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
// Wait for the design system root + some real content to mount.
await page.waitForSelector('.cn-root', { timeout: 15000 })
await page.waitForTimeout(1200) // settle fonts/illustrations

await page.screenshot({ path: out, fullPage: false })

const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 400)
console.log(JSON.stringify({ url, out, consoleErrors: errors, bodyTextSample: text }, null, 2))

await browser.close()
