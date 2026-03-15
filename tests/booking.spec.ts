import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:8080/login');
    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Masuk Sekarang")');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should complete a booking journey', async ({ page }) => {
    // Navigate to booking
    await page.click('text=PANGGIL SEKARANG');
    await expect(page).toHaveURL(/.*booking/);

    // Step 1: Location & Vehicle
    await page.fill('input[placeholder="Masukkan alamat lengkap"]', 'Jl. Sudirman No. 1, Jakarta');
    await page.selectOption('select#brand', 'Toyota');
    await page.fill('input[placeholder="Avanza, Vario, dll"]', 'Corolla Cross');
    await page.fill('input[placeholder="2019"]', '2023');
    await page.fill('input[placeholder="B 1234 XYZ"]', 'B 8888 OK');

    // Use AI Diagnostic simulation
    await page.fill('textarea', 'Mesin bunyi klotok-klotok di bagian depan');
    await page.click('text=AI DIAGNOSTIC');

    // Wait for AI response (mapping should change it to Tune Up or similar)
    await page.waitForTimeout(3000);

    await page.click('text=Lanjutkan ke Pemilihan Mekanik');

    // Step 2: Mechanic Selection
    await page.click('text=Jane Mechanic');
    await page.click('text=Lanjutkan ke Konfirmasi');

    // Step 3: Confirmation
    await expect(page.locator('h3')).toContainText('Detail Booking');
    await page.click('button:has-text("Konfirmasi Booking")');

    // Verify Tracking Page
    await expect(page).toHaveURL(/.*tracking/);
    await expect(page.locator('h1')).toContainText('LACAK PESANAN');
  });
});
