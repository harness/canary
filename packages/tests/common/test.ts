import { expect, Page, TestDetails, TestInfo } from '@playwright/test'

import {
  CONTENT_SELECTOR_ANNOTATION,
  SCREENSHOT_TAG,
  URL_ANNOTATION,
  WAIT_FOR_SELECTOR_ANNOTATION
} from '../../../playwright.config'

export const testDetails = (pageRoute: string, waitForSelector?: string): TestDetails => ({
  tag: SCREENSHOT_TAG,
  annotation: [
    {
      type: URL_ANNOTATION,
      description: `${process.env.VIEW_PREVIEW_BASE_URL}${pageRoute}`
    },
    {
      type: CONTENT_SELECTOR_ANNOTATION,
      description: buildSelectorString()
    },
    ...(waitForSelector
      ? [
          {
            type: WAIT_FOR_SELECTOR_ANNOTATION,
            description: waitForSelector
          }
        ]
      : [])
  ]
})

export const testScreenshot = async (
  page: Page,
  testInfo: TestInfo,
  pageRoute: string,
  waitForSelector: string = buildSelectorString()
): Promise<void> => {
  await page.goto(pageRoute, {
    waitUntil: 'load'
  })

  await page.waitForSelector(waitForSelector)

  const $element = page.locator(buildSelectorString()).last() // last() should find the deepest ID from CONTENT_SELECTOR_IDS

  await testInfo.attach('Screenshot of Element Under Test', {
    body: await $element.screenshot(),
    contentType: 'image/png'
  })

  await expect($element).toHaveScreenshot()
}

const buildSelectorString = (): string => {
  return process.env.CONTENT_SELECTOR_IDS.split(',')
    .map(selector => {
      return `#${selector}`
    })
    .join(',')
}
