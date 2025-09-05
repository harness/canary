import { test } from '@playwright/test'

import { testDetails, testScreenshot } from './common/test'

const PAGE_ROUTE: string = 'secrets-multi-select-page'
const WAIT_FOR_SELECTOR: string = '.cn-drawer-content'

test.describe(PAGE_ROUTE, testDetails(PAGE_ROUTE), () => {
  test('matches screenshot', async ({ page }, testInfo) => {
    await testScreenshot(page, testInfo, PAGE_ROUTE, 2000, WAIT_FOR_SELECTOR)
  })
})
