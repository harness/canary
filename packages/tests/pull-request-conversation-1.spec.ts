import { test } from '@playwright/test'

import { testDetails, testScreenshot } from './common/test'

const PAGE_ROUTE: string = 'pull-request-conversation-1'

test.describe(PAGE_ROUTE, testDetails(PAGE_ROUTE), () => {
  test('matches screenshot', async ({ page }, testInfo) => {
    await testScreenshot(page, testInfo, PAGE_ROUTE)
  })
})
