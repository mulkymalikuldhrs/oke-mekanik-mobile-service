import { test, expect } from '@playwright/test';

test.describe('Oke Mekanik Full-Stack E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start at the landing page
    await page.goto('http://localhost:8080');
  });

  test('landing page visual and functional check', async ({ page }) => {
    await expect(page).toHaveTitle(/Oke Mekanik/);
    await expect(page.locator('h2')).toContainText(/Bengkel Keliling Terpercaya/i);
    await page.screenshot({ path: 'screenshots/landing_verify.png', fullPage: true });
  });

  test('customer login flow', async ({ page }) => {
    await page.goto('http://localhost:8080/login');

    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Select role
    await page.click('button:has-text("Pelanggan")');
    await page.click('role=option >> text=Pelanggan');

    await page.click('button:has-text("MASUK SEKARANG")');

    await expect(page).toHaveURL(/\/customer\/dashboard/);
    await expect(page.locator('h1')).toContainText(/OKE MEKANIK/i);
    await page.screenshot({ path: 'screenshots/dashboard_verify.png', fullPage: true });
  });

  test('ai-powered booking flow', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:8080/login');
    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Pelanggan")');
    await page.click('role=option >> text=Pelanggan');
    await page.click('button:has-text("MASUK SEKARANG")');

    await page.goto('http://localhost:8080/customer/booking');

    // Step 1: Location & Problem
    await page.fill('input[id="address"]', 'Jl. Sudirman No. 1, Jakarta');
    await page.selectOption('select#brand', 'Toyota');
    await page.fill('input[id="model"]', 'Avanza');
    await page.fill('textarea[placeholder*="Tuliskan gejala"]', 'mesin mobil saya brebet dan mogok di jalan');

    // Check AI Diagnostic
    await page.click('button:has-text("AI DIAGNOSTIC")');
    await page.waitForSelector('text=Tune Up');

    await page.click('button:has-text("Lanjutkan ke Pemilihan Mekanik")');

    // Step 2: Mechanic Selection
    await expect(page.locator('text=Pilih Mekanik')).toBeVisible();
    await page.waitForSelector('.glass-card');
    await page.click('h3:has-text("Jane Mechanic")');

    await page.click('button:has-text("Lanjutkan ke Konfirmasi")');

    // Step 3: Confirmation
    await expect(page.locator('text=Konfirmasi Booking')).toBeVisible();
    await page.click('button:has-text("Konfirmasi Booking")');

    // Wait for redirect to tracking
    await page.waitForURL(/\/customer\/tracking/);
    await expect(page.locator('h1')).toContainText(/Tracking Mekanik/i);
    await page.screenshot({ path: 'screenshots/tracking_verify.png', fullPage: true });
  });
});
