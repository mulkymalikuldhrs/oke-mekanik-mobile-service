import { test, expect } from '@playwright/test';

test.describe('Oke Mekanik Full-Stack E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start at the landing page
    await page.goto('http://localhost:8080');
  });

  test('landing page visual and functional check', async ({ page }) => {
    await expect(page).toHaveTitle(/Oke Mekanik/i);
    // Heading in Index.tsx is "Bengkel Keliling Terpercaya" (translated from hero.title)
    await expect(page.locator('h2')).toContainText(/Bengkel Keliling Terpercaya/i);
    await page.screenshot({ path: 'screenshots/landing_verify.png', fullPage: true });
  });

  test('customer login flow', async ({ page }) => {
    // The "Mulai Sekarang" button in Index.tsx redirects to /register, let's go directly to /login
    await page.goto('http://localhost:8080/login');
    await expect(page).toHaveURL(/\/login/);

    await page.fill('input[id="email"]', 'customer@example.com');
    await page.fill('input[id="password"]', 'password123');

    // Select role using Shadcn Select
    await page.click('button:has-text("Pelanggan")');
    await page.click('role=option >> text=Pelanggan');

    await page.click('button:has-text("MASUK SEKARANG")');

    await expect(page).toHaveURL(/\/customer\/dashboard/);
    // Header in CustomerDashboard.tsx has <h1>OKE MEKANIK</h1>
    await expect(page.locator('h1 >> text=OKE MEKANIK')).toBeVisible();
    await page.screenshot({ path: 'screenshots/dashboard_verify.png', fullPage: true });
  });

  test('ai-powered booking flow', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:8080/login');
    await page.fill('input[id="email"]', 'customer@example.com');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button:has-text("Pelanggan")');
    await page.click('role=option >> text=Pelanggan');
    await page.click('button:has-text("MASUK SEKARANG")');

    await expect(page).toHaveURL(/\/customer\/dashboard/);
    await page.click('text=PANGGIL SEKARANG');
    await expect(page).toHaveURL(/\/customer\/booking/);

    // Step 1: Location & Problem
    await page.fill('input[id="address"]', 'Jl. Sudirman No. 1, Jakarta');
    await page.selectOption('select[id="brand"]', 'Toyota');
    await page.fill('input[id="model"]', 'Avanza');
    await page.fill('input[id="year"]', '2020');
    await page.fill('input[id="licensePlate"]', 'B 1234 XYZ');

    // AI Diagnostic trigger
    await page.fill('textarea[placeholder*="gejala atau masalah"]', 'mesin mobil saya brebet dan mogok di jalan');
    await page.click('button:has-text("AI DIAGNOSTIC")');

    // Wait for AI response (Tune Up is expected for 'brebet' and 'mogok')
    await page.waitForSelector('text=Analisa AI Selesai');

    await page.click('button:has-text("Lanjutkan ke Pemilihan Mekanik")');

    // Step 2: Mechanic Selection
    await expect(page.locator('text=Pilih Mekanik')).toBeVisible();
    // Click on the first mechanic card
    await page.click('.glass-card >> text=Verified >> nth=0');
    await page.click('button:has-text("Lanjutkan ke Konfirmasi")');

    // Step 3: Confirmation
    await expect(page.locator('h3:has-text("Konfirmasi Booking")')).toBeVisible();
    await page.click('button:has-text("Konfirmasi Booking")');

    // Wait for redirect to tracking
    await page.waitForURL(/\/customer\/tracking/);
    // Header in TrackingPage.tsx has <h1>LACAK PESANAN</h1>
    await expect(page.locator('h1 >> text=LACAK PESANAN')).toBeVisible();
    await page.screenshot({ path: 'screenshots/tracking_verify.png', fullPage: true });
  });
});
