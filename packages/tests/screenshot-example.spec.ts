import { test, expect } from '@playwright/test';

test('matches screenshot', async ({ page }) => {
  await page.goto('https://harness-xd-review.netlify.app/view-preview/repo-list');

  await expect(page).toHaveScreenshot();
});
