import { defineConfig, devices } from '@playwright/test'
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import { config } from 'dotenv'

config()

/**
 * Shared configuration constants
 */
export const SCREENSHOT_TAG: string = '@screenshot'
export const URL_ANNOTATION: string = 'Link to Page Under Test'

const PLAYWRIGHT_OUTPUT_DIR: string = 'playwright-results'

/**
 * Main test configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Directory that will be recursively scanned for test files */
  testDir: './packages/tests',
  /* The output directory for files created during test execution */
  outputDir: PLAYWRIGHT_OUTPUT_DIR,
  /* Directory of reference screenshots to compare against */
  snapshotPathTemplate: '{testDir}/__screenshots/{testFilePath}/{projectName}-{testName}{ext}',
  /* Run tests in files in parallel */
  fullyParallel: !process.env.CI,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      'list',
      {
        printSteps: true
      }
    ],
    [
      'html',
      {
        open: 'never'
      }
    ],
    [
      'junit',
      {
        outputFile: `${PLAYWRIGHT_OUTPUT_DIR}/junit-results.xml`
      }
    ],
    ['github']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.VIEW_PREVIEW_BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Viewport size for Page object */
    viewport: { width: 1500, height: 1500 }
  },
  /* Configuration for the expect assertion library. See https://playwright.dev/docs/test-configuration#expect-options */
  expect: {
    timeout: 20000 // A couple of the tests have large renders and currently require increasing the timeout
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
