import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully as customer', async ({ page }) => {
    await page.goto('http://localhost:8080/login');

    // Fill in credentials (seeded in db.js)
    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Select customer role
    await page.getByLabel('Masuk sebagai').click();
    await page.getByRole('option', { name: 'Pelanggan' }).click();

    // Submit
    await page.getByRole('button', { name: 'MASUK SEKARANG' }).click();

    // Verify redirection to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('OKE MEKANIK');
  });

});
