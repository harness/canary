// Prove the create-drawer Confirm shows a loading state mid-save.
// Loads the empty flow, opens the drawer, fills the form, clicks Confirm, and
// captures the button DURING the ~900ms save window, then after the row lands.
import pkg from '/Users/jared/code/canary-manifest/node_modules/.pnpm/playwright-core@1.55.0/node_modules/playwright-core/index.js'
const { chromium } = pkg

const exec =
  '/Users/jared/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const out = '/tmp/refine'
const browser = await chromium.launch({ executablePath: exec })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 2 })
await ctx.addInitScript(() => { try { sessionStorage.setItem('view-preview-theme', 'light-std-std') } catch {} })
const page = await ctx.newPage()
const logs = []
await page.goto('http://localhost:5173/view-preview/fme-flag-list-flow', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(700)

// open drawer
await page.getByRole('button', { name: /New Feature Flag/i }).last().click()
await page.waitForTimeout(500)

// fill Name
await page.getByPlaceholder('Enter a name').fill('async-save-demo')
// pick Traffic Type
await page.getByText('Select traffic type').click()
await page.waitForTimeout(300)
const userOpt = page.getByRole('option', { name: /^User$/i })
if (await userOpt.count()) await userOpt.first().click()
else await page.getByText(/^User$/).last().click().catch(() => logs.push('user opt fail'))
await page.waitForTimeout(300)

// Click Confirm and immediately sample the loading state (don't await network idle)
const confirm = page.getByRole('button', { name: /Confirm/ })
await confirm.click()
await page.waitForTimeout(250) // mid-save (well within the 900ms window)
// Is the confirm button disabled / showing loading right now?
const midDisabled = await confirm.isDisabled().catch(() => null)
const midHtml = await confirm.evaluate(el => el.outerHTML).catch(() => '')
logs.push(`mid-save Confirm disabled: ${midDisabled}`)
logs.push(`mid-save Confirm has spinner/loading class: ${/loading|spinner|animate/i.test(midHtml)}`)
await page.screenshot({ path: `${out}/loading-midsave.png`, fullPage: true })

// wait for the save to resolve
await page.waitForTimeout(900)
const rowVisible = await page.getByText('async-save-demo').count()
logs.push(`after save, new row visible: ${rowVisible}`)
const drawerGone = (await page.getByText('Create a Feature Flag').count()) === 0
logs.push(`drawer closed after save: ${drawerGone}`)
await page.screenshot({ path: `${out}/after-save.png`, fullPage: true })

console.log(JSON.stringify({ logs }, null, 2))
await browser.close()
