import { expect, test } from '@playwright/test'

const PAGE_ROUTE = 'data-table-column-resizing-demo'

test.describe(PAGE_ROUTE, () => {
  test('resizes a grouped leaf column from the header boundary', async ({ page }) => {
    await page.goto(PAGE_ROUTE)

    const grouped = page.getByTestId('column-resizing-grouped')
    const ageResizer = grouped.locator('[data-column-resizer][data-column-id="age"]')
    const nameResizer = grouped.locator('[data-column-resizer][data-column-id="name"]')
    const visitsResizer = grouped.locator('[data-column-resizer][data-column-id="visits"]')
    const groupResizer = grouped.locator('[data-column-resizer][data-column-id="info"]')
    const statusResizer = grouped.locator('[data-column-resizer][data-column-id="status"]')

    await expect(ageResizer).toBeVisible()
    await expect(nameResizer).toBeVisible()
    await expect(visitsResizer).toBeVisible()
    await expect(groupResizer).toHaveCount(0)
    await expect(statusResizer).toHaveCount(0)

    const ageHead = grouped.locator('th:has([data-column-resizer][data-column-id="age"])')
    const visitsHead = grouped.locator('th:has([data-column-resizer][data-column-id="visits"])')
    const infoHead = grouped.getByText('Info', { exact: true }).locator('xpath=ancestor::th[1]')
    const ageCell = grouped.locator('tbody tr').first().locator('td').nth(1)

    const ageHeadBox = await ageHead.boundingBox()
    const resizerBox = await ageResizer.boundingBox()
    const visitsHeadBox = await visitsHead.boundingBox()

    expect(ageHeadBox).toBeTruthy()
    expect(resizerBox).toBeTruthy()
    expect(visitsHeadBox).toBeTruthy()

    expect(Math.abs(resizerBox!.x + resizerBox!.width - (ageHeadBox!.x + ageHeadBox!.width))).toBeLessThanOrEqual(1)
    expect(Math.abs(ageHeadBox!.x + ageHeadBox!.width - visitsHeadBox!.x)).toBeLessThanOrEqual(1)

    const startAgeWidth = Number.parseFloat(
      (await ageHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0'
    )
    const startVisitsWidth = Number.parseFloat(
      (await visitsHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0'
    )
    const startAgeRendered = ageHeadBox!.width
    const startAgeCellRendered = (await ageCell.boundingBox())?.width ?? 0
    const startInfoRendered = (await infoHead.boundingBox())?.width ?? 0

    await ageResizer.hover()
    await page.mouse.down()
    await page.mouse.move(resizerBox!.x + resizerBox!.width / 2 + 40, resizerBox!.y + resizerBox!.height / 2, {
      steps: 5
    })

    const indicator = grouped.locator('[data-column-resize-indicator]')
    await expect(indicator).toBeVisible()
    const indicatorBox = await indicator.boundingBox()
    const ageHeadDuringDrag = await ageHead.boundingBox()
    const theadBox = await grouped.locator('thead').boundingBox()
    expect(indicatorBox).toBeTruthy()
    expect(ageHeadDuringDrag).toBeTruthy()
    expect(theadBox).toBeTruthy()
    expect(Math.abs(indicatorBox!.height - ageHeadDuringDrag!.height)).toBeLessThanOrEqual(2)
    expect(Math.abs(indicatorBox!.y - ageHeadDuringDrag!.y)).toBeLessThanOrEqual(2)
    expect(
      Math.abs(indicatorBox!.x + indicatorBox!.width / 2 - (ageHeadDuringDrag!.x + ageHeadDuringDrag!.width))
    ).toBeLessThanOrEqual(1)
    expect(indicatorBox!.height).toBeLessThan((theadBox!.height ?? 0) - 8)

    await page.mouse.up()
    await expect(grouped.locator('tbody tr').first()).toContainText('Alice Chen')

    const endAgeWidth = Number.parseFloat(
      (await ageHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0'
    )
    const endVisitsWidth = Number.parseFloat(
      (await visitsHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0'
    )
    const endAgeRendered = (await ageHead.boundingBox())?.width ?? 0
    const endAgeCellRendered = (await ageCell.boundingBox())?.width ?? 0
    const endInfoRendered = (await infoHead.boundingBox())?.width ?? 0

    expect(endAgeWidth).toBeGreaterThan(startAgeWidth)
    expect(endAgeRendered).toBeGreaterThan(startAgeRendered)
    expect(endAgeCellRendered).toBeGreaterThan(startAgeCellRendered)
    expect(endVisitsWidth).toBe(startVisitsWidth)
    expect(endInfoRendered).toBeGreaterThan(startInfoRendered)
    await expect(infoHead).toHaveAttribute('colspan', '4')

    await grouped.getByText('Age', { exact: true }).click()
    await expect(grouped.locator('tbody tr').first()).toContainText('Diego Rivera')
  })

  test('keeps a wide single-header table horizontally scrollable while resizing', async ({ page }) => {
    await page.goto(PAGE_ROUTE)

    const scrollable = page.getByTestId('column-resizing-scroll')
    const scroller = scrollable.locator('.overflow-x-auto')
    const teamResizer = scrollable.locator('[data-column-resizer][data-column-id="team"]')
    const statusResizer = scrollable.locator('[data-column-resizer][data-column-id="status"]')

    await expect(teamResizer).toHaveCount(1)
    await expect(statusResizer).toHaveCount(0)

    await expect
      .poll(async () => {
        return scroller.evaluate(el => el.scrollWidth > el.clientWidth)
      })
      .toBe(true)

    await scroller.evaluate(el => {
      el.scrollLeft = 240
    })

    await expect(teamResizer).toBeVisible()

    const teamHead = scrollable.locator('th:has([data-column-resizer][data-column-id="team"])')
    const startWidth = Number.parseFloat(
      (await teamHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0'
    )
    const resizerBox = await teamResizer.boundingBox()
    expect(resizerBox).toBeTruthy()

    await teamResizer.hover()
    await page.mouse.down()
    await page.mouse.move(resizerBox!.x + resizerBox!.width / 2 + 40, resizerBox!.y + resizerBox!.height / 2, {
      steps: 5
    })

    const indicator = scrollable.locator('[data-column-resize-indicator]')
    await expect(indicator).toBeVisible()
    const indicatorBox = await indicator.boundingBox()
    const headerBox = await scrollable.locator('thead').boundingBox()
    expect(indicatorBox).toBeTruthy()
    expect(headerBox).toBeTruthy()
    expect(Math.abs(indicatorBox!.height - headerBox!.height)).toBeLessThanOrEqual(2)

    await page.mouse.up()

    const endWidth = Number.parseFloat((await teamHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0')
    expect(endWidth).toBeGreaterThan(startWidth)
    await expect
      .poll(async () => {
        return scroller.evaluate(el => el.scrollWidth > el.clientWidth)
      })
      .toBe(true)
  })

  test('keeps a full-width table stable while a middle column redistributes space', async ({ page }) => {
    await page.goto(PAGE_ROUTE)

    const fullWidth = page.getByTestId('column-resizing-single-full')
    const table = fullWidth.locator('table')
    const scroller = fullWidth.locator('.overflow-x-auto')
    const visitsResizer = fullWidth.locator('[data-column-resizer][data-column-id="visits"]')
    const visitsHead = fullWidth.locator('th:has([data-column-resizer][data-column-id="visits"])')
    const ageHead = fullWidth.locator('th:has([data-column-resizer][data-column-id="age"])')
    const progressHead = fullWidth.locator('th:has([data-column-resizer][data-column-id="profileProgress"])')
    const statusHead = fullWidth.getByText('Status', { exact: true }).locator('xpath=ancestor::th[1]')

    await expect
      .poll(async () => {
        const tableBox = await table.boundingBox()
        const containerBox = await fullWidth.boundingBox()
        return Math.abs((tableBox?.width ?? 0) - (containerBox?.width ?? 0))
      })
      .toBeLessThanOrEqual(2)

    await expect
      .poll(async () => {
        return scroller.evaluate(el => el.scrollWidth <= el.clientWidth + 1)
      })
      .toBe(true)

    const startTableWidth = (await table.boundingBox())?.width ?? 0
    const startVisitsWidth = (await visitsHead.boundingBox())?.width ?? 0
    const startSiblingWidth =
      ((await ageHead.boundingBox())?.width ?? 0) + ((await progressHead.boundingBox())?.width ?? 0)
    const startStatusSizingWidth = Number.parseFloat(
      (await statusHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0'
    )
    const resizerBox = await visitsResizer.boundingBox()
    expect(resizerBox).toBeTruthy()

    await visitsResizer.hover()
    await page.mouse.down()
    await page.mouse.move(resizerBox!.x + resizerBox!.width / 2 + 50, resizerBox!.y + resizerBox!.height / 2, {
      steps: 5
    })

    const indicator = fullWidth.locator('[data-column-resize-indicator]')
    await expect(indicator).toHaveCount(1)
    await expect(indicator).toBeVisible()
    const indicatorBox = await indicator.boundingBox()
    const visitsHeadDuringDrag = await visitsHead.boundingBox()
    const handleLineColor = await visitsResizer.evaluate(
      element => getComputedStyle(element, '::after').backgroundColor
    )
    expect(indicatorBox).toBeTruthy()
    expect(visitsHeadDuringDrag).toBeTruthy()
    expect(
      Math.abs(indicatorBox!.x + indicatorBox!.width / 2 - (visitsHeadDuringDrag!.x + visitsHeadDuringDrag!.width))
    ).toBeLessThanOrEqual(1)
    expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(handleLineColor)

    await page.mouse.up()

    const endTableWidth = (await table.boundingBox())?.width ?? 0
    const endVisitsWidth = (await visitsHead.boundingBox())?.width ?? 0
    const endSiblingWidth =
      ((await ageHead.boundingBox())?.width ?? 0) + ((await progressHead.boundingBox())?.width ?? 0)
    const endStatusSizingWidth = Number.parseFloat(
      (await statusHead.getAttribute('style'))?.match(/width:\s*([\d.]+)px/)?.[1] || '0'
    )

    expect(endVisitsWidth).toBeGreaterThan(startVisitsWidth)
    expect(Math.abs(endTableWidth - startTableWidth)).toBeLessThanOrEqual(2)
    expect(endSiblingWidth).toBeLessThan(startSiblingWidth)
    expect(endStatusSizingWidth).toBe(startStatusSizingWidth)
  })

  test('keeps a wide grouped-header table horizontally scrollable while resizing', async ({ page }) => {
    await page.goto(PAGE_ROUTE)

    const scrollable = page.getByTestId('column-resizing-grouped-scroll')
    const scroller = scrollable.locator('.overflow-x-auto')
    const teamResizer = scrollable.locator('[data-column-resizer][data-column-id="team"]')

    await expect(teamResizer).toBeVisible()
    await expect
      .poll(async () => {
        return scroller.evaluate(el => el.scrollWidth > el.clientWidth)
      })
      .toBe(true)
  })
})
