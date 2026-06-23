// Drive the FME flag-list interactive flow and capture each state transition.
// Usage: node scripts/drive-flow.mjs <slug> <outdir> [theme]
import pkg from '/Users/jared/code/canary-manifest/node_modules/.pnpm/playwright-core@1.55.0/node_modules/playwright-core/index.js'
const { chromium } = pkg

const [, , slug = 'fme-flag-list-flow', outdir = '/tmp/flow', theme = 'light-std-std'] = process.argv
const exec =
  '/Users/jared/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

const browser = await chromium.launch({ executablePath: exec })
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  deviceScaleFactor: 2
})
await ctx.addInitScript(t => {
  try { sessionStorage.setItem('view-preview-theme', t) } catch {}
}, theme)
const page = await ctx.newPage()
const logs = []
const url = `http://localhost:5173/view-preview/${slug}`
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(700)

async function shot(name) {
  await page.screenshot({ path: `${outdir}/${name}.png`, fullPage: true })
  logs.push(`shot ${name}`)
}

// 1. Empty / first-run
await shot('1-empty')

// 2. Click the in-body "New Feature Flag" CTA → drawer opens
//    (there are two; the NoData one is the second / in-body. Click the first visible.)
const createButtons = page.getByRole('button', { name: /New Feature Flag/i })
const count = await createButtons.count()
logs.push(`New Feature Flag buttons found: ${count}`)
await createButtons.last().click()
await page.waitForTimeout(600)
await shot('2-drawer-open')

// 3. Fill Name
const nameInput = page.getByPlaceholder('Enter a name')
await nameInput.fill('checkout-redesign-2026')
await page.waitForTimeout(200)

// 4. Pick Traffic Type (Select trigger → option)
const trafficTrigger = page.getByText('Select traffic type')
await trafficTrigger.click()
await page.waitForTimeout(400)
// option "User"
const userOpt = page.getByRole('option', { name: /^User$/i })
const optCount = await userOpt.count()
logs.push(`traffic options visible: ${optCount}`)
if (optCount > 0) {
  await userOpt.first().click()
} else {
  // fallback: click any menu item labelled User
  await page.getByText(/^User$/).last().click().catch(() => logs.push('User option click failed'))
}
await page.waitForTimeout(300)
await shot('3-form-filled')

// 5. Confirm → drawer closes, new row prepended to list
const confirm = page.getByRole('button', { name: /^Confirm$/ })
const confirmDisabled = await confirm.isDisabled().catch(() => null)
logs.push(`Confirm disabled before submit: ${confirmDisabled}`)
await confirm.click()
await page.waitForTimeout(800)
await shot('4-after-create')

// 6. Report whether the new flag name appears in the list
const rowVisible = await page.getByText('checkout-redesign-2026').count()
logs.push(`new flag row visible after create: ${rowVisible}`)

console.log(JSON.stringify({ slug, theme, logs }, null, 2))
await browser.close()
