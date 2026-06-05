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

    // Step 1: Pilih Layanan
    await page.waitForSelector('h2:has-text("Pilih Layanan")');

    // AI Diagnostic - The textarea is inside a card
    await page.fill('textarea', 'mesin mobil saya brebet dan mogok di jalan');
    // Button with sparkles icon
    await page.locator('button:has(.lucide-sparkles), button:has-text("AI")').first().click();

    // Wait for AI result
    await page.waitForTimeout(3000);

    await page.click('button:has-text("Lanjutkan")');

    // Step 2: Location & Vehicle
    await page.waitForSelector('h2:has-text("Lokasi & Kendaraan")');
    await page.fill('input[placeholder*="Sudirman"]', 'Jl. Sudirman No. 1, Jakarta');

    // Select brand
    await page.selectOption('select', 'Toyota');

    // Model, Year, License Plate
    await page.locator('input[placeholder*="Avanza"]').fill('Avanza');
    await page.locator('input[placeholder="2020"]').fill('2020');
    await page.locator('input[placeholder="B 1234 XY"]').fill('B 1234 OK');

    await page.click('button:has-text("Cari Mekanik")');

    // Step 3: Choose Mechanic
    await page.waitForSelector('h2:has-text("Pilih Mekanik")');
    await page.click('text=Jane Mechanic');
    await page.click('button:has-text("Lanjutkan")');

    // Step 4: Confirmation
    await page.waitForSelector('h2:has-text("Konfirmasi Pesanan")');
    await page.click('button:has-text("KONFIRMASI PESANAN")');

    // Wait for redirect to tracking
    await page.waitForURL(/\/customer\/tracking/);
    await expect(page.locator('h1')).toContainText(/LACAK PESANAN/i);
    await page.screenshot({ path: 'screenshots/tracking_verify.png', fullPage: true });
  });
});
