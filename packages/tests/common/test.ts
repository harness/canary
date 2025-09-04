import { expect, Page, PageAssertionsToHaveScreenshotOptions, TestDetails } from '@playwright/test'

import { SCREENSHOT_TAG, URL_ANNOTATION } from '../../../playwright.config'

const SCREENSHOT_CONFIG: PageAssertionsToHaveScreenshotOptions = {
  fullPage: true
}

export const testDetails = (pageRoute: string): TestDetails => ({
  tag: SCREENSHOT_TAG,
  annotation: {
    type: URL_ANNOTATION,
    description: `${process.env.VIEW_PREVIEW_BASE_URL}${pageRoute}`
  }
})

export const testScreenshot = async (page: Page, pageRoute: string): Promise<void> => {
  await page.goto(pageRoute, {
    waitUntil: 'domcontentloaded'
  })

  const $element = page.locator(buildSelectorString()).first()

  await expect($element).toHaveScreenshot(SCREENSHOT_CONFIG)
}

const buildSelectorString = (): string => {
  return process.env.CONTENT_SELECTOR_IDS.split(',')
    .map(selector => {
      return `#${selector}`
    })
    .join(',')
}
