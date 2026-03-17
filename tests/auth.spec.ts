import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully as customer', async ({ page }) => {
    await page.goto('http://localhost:8080/login');

    // Fill in credentials (seeded in db.js)
    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Select customer role (optional if default is Pelanggan/customer, but let's try a safer selector)
    await page.click('button:has-text("Pelanggan")');
    await page.click('role=option >> text=Mekanik'); // Toggle to be sure
    await page.click('button:has-text("Mekanik")');
    await page.click('role=option >> text=Pelanggan');

    // Submit
    await page.click('button:has-text("MASUK SEKARANG")');

    // Verify redirection to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('OKE MEKANIK');
  });

});
