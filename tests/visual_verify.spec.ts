import { test, expect } from '@playwright/test';

test.describe('Oke Mekanik Full-Stack E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start at the landing page
    await page.goto('http://localhost:8080');
  });

  test('landing page visual and functional check', async ({ page }) => {
    await expect(page.locator('header h1')).toContainText(/OKE MEKANIK/i);
    await page.screenshot({ path: 'screenshots/landing_verify.png', fullPage: true });
  });

  test('customer login flow', async ({ page }) => {
    // Navigate to login directly
    await page.goto('http://localhost:8080/login');
    await expect(page).toHaveURL(/\/login/);

    await page.fill('input[id="email"]', 'customer@example.com');
    await page.fill('input[id="password"]', 'password123');

    // MASUK SEKARANG button
    const loginBtn = page.locator('button:has-text("MASUK SEKARANG")');
    await loginBtn.click();

    await expect(page).toHaveURL(/\/customer\/dashboard/);
    await expect(page.locator('header h1')).toContainText(/OKE MEKANIK/i);
    await page.screenshot({ path: 'screenshots/dashboard_verify.png', fullPage: true });
  });

  test('ai-powered booking flow', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:8080/login');
    await page.fill('input[id="email"]', 'customer@example.com');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button:has-text("MASUK SEKARANG")');

    await expect(page).toHaveURL(/\/customer\/dashboard/);

    await page.goto('http://localhost:8080/customer/booking');

    // Step 1: Location & Problem
    await page.waitForSelector('input[id="address"]');
    await page.fill('input[id="address"]', 'Jl. Sudirman No. 1, Jakarta');
    await page.selectOption('select[id="brand"]', 'Toyota');
    await page.fill('input[id="model"]', 'Avanza');
    await page.fill('input[id="year"]', '2020');
    await page.fill('input[id="licensePlate"]', 'B 1234 OK');

    // AI Diagnostic
    await page.fill('textarea[placeholder*="gejala"]', 'mesin mobil saya brebet dan mogok di jalan');
    await page.click('button:has-text("AI DIAGNOSTIC")');

    // Wait for AI result
    await page.waitForTimeout(3000);

    await page.click('button:has-text("Lanjutkan ke Pemilihan Mekanik")');

    // Step 2: Mechanic Selection
    await page.waitForSelector('h3:has-text("Jane Mechanic")');
    await page.click('h3:has-text("Jane Mechanic")');
    await page.click('button:has-text("Lanjutkan ke Konfirmasi")');

    // Step 3: Confirmation
    await page.waitForSelector('h3:has-text("Detail Booking")');
    await page.click('button:has-text("Konfirmasi Booking")');

    // Wait for redirect to tracking
    await page.waitForURL(/\/customer\/tracking/);
    await expect(page.locator('h1')).toContainText(/LACAK PESANAN/i);
    await page.screenshot({ path: 'screenshots/tracking_verify.png', fullPage: true });
  });
});
