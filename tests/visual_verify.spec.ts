import { test, expect } from '@playwright/test';

test('verify landing page', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page).toHaveTitle(/Oke Mekanik/);
  await page.screenshot({ path: 'screenshots/landing_verify.png', fullPage: true });
});
