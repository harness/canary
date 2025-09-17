import { test } from '@playwright/test'

import { testDetails, testScreenshot } from './common/test'

const PAGE_ROUTE: string = 'create-rule'
const WAIT_FOR_SELECTOR: string = '.cn-form'

test.describe(PAGE_ROUTE, testDetails(PAGE_ROUTE, WAIT_FOR_SELECTOR), () => {
  test('matches screenshot', async ({ page }, testInfo) => {
    await testScreenshot(page, testInfo, PAGE_ROUTE, 0, WAIT_FOR_SELECTOR)
  })
})
