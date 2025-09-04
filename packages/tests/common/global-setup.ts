import { FullConfig } from '@playwright/test'

export function globalSetup(_config: FullConfig): void {
  // @ts-ignore
  process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = true // https://github.com/microsoft/playwright/issues/28995
}

export default globalSetup
