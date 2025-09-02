import { expect, Page, PageAssertionsToHaveScreenshotOptions, TestDetails } from '@playwright/test'

import { SCREENSHOT_TAG, URL_ANNOTATION } from './config'
import { CONTENT_SELECTOR } from './selectors'

const PREVIEW_BASE_URL: string = 'https://harness-xd-review.netlify.app/view-preview'
const SCREENSHOT_CONFIG: PageAssertionsToHaveScreenshotOptions = {
  fullPage: true
}

const fullUrl = (pageRoute: string): string => `${PREVIEW_BASE_URL}/${pageRoute}`

export const testDetails = (pageRoute: string): TestDetails => ({
  tag: SCREENSHOT_TAG,
  annotation: {
    type: URL_ANNOTATION,
    description: fullUrl(pageRoute)
  }
})

export const testScreenshot = async (
  page: Page,
  pageRoute: string,
  selector: string = CONTENT_SELECTOR
): Promise<void> => {
  await page.goto(fullUrl(pageRoute))

  await page.waitForSelector(selector)
  const $element = page.locator(selector).first()

  await expect($element).toHaveScreenshot(SCREENSHOT_CONFIG)
}
