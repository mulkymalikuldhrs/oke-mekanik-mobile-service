import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully as customer', async ({ page }) => {
    await page.goto('http://localhost:8080/login');

    // Fill in credentials (seeded in db.js)
    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Select customer role
    await page.click('button:has-text("Pelanggan")');

    // Submit
    await page.click('button:has-text("Masuk Sekarang")');

    // Verify redirection to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('OKE MEKANIK');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:8080/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button:has-text("Masuk Sekarang")');

    await expect(page.locator('text=Email atau password salah')).toBeVisible();
  });
});
