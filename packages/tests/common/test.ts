import { expect, Page, PageAssertionsToHaveScreenshotOptions, TestDetails } from '@playwright/test'

import { SCREENSHOT_TAG, URL_ANNOTATION } from './config'
import { CONTENT_SELECTOR } from './selectors'

const SCREENSHOT_CONFIG: PageAssertionsToHaveScreenshotOptions = {
  fullPage: true
}

export const testDetails = (pageRoute: string): TestDetails => ({
  tag: SCREENSHOT_TAG,
  annotation: {
    type: URL_ANNOTATION,
    description: pageRoute
  }
})

export const testScreenshot = async (
  page: Page,
  pageRoute: string,
  selector: string = CONTENT_SELECTOR
): Promise<void> => {
  await page.goto(pageRoute)

  await page.waitForSelector(selector)
  const $element = page.locator(selector).first()

  await expect($element).toHaveScreenshot(SCREENSHOT_CONFIG)
}
