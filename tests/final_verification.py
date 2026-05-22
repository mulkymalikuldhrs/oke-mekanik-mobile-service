
import asyncio
from playwright.async_api import async_playwright
import os

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        print("--- Starting Final Verification ---")

        # 1. Landing Page
        try:
            print("Navigating to Landing Page...")
            await page.goto("http://localhost:8080", timeout=60000)
            await page.wait_for_selector("text=OKE MEKANIK", timeout=10000)
            await page.screenshot(path="verification_landing.png")
            print("Landing screenshot saved.")
        except Exception as e:
            print(f"Landing Page Error: {e}")

        # 2. Login Page
        try:
            print("Navigating to Login Page...")
            await page.click("text=Masuk")
            await page.wait_for_url("**/login")

            print("Filling Login Form...")
            await page.fill("input[placeholder='nama@email.com']", "customer@example.com")
            await page.fill("input[placeholder='******']", "password123")

            await page.screenshot(path="verification_login.png")
            # Using the exact button text from translation: 'MASUK SEKARANG'
            await page.click("button:has-text('MASUK SEKARANG')")

            # Wait for Dashboard
            await page.wait_for_url("**/customer/dashboard", timeout=15000)
            print("Successfully logged in to Customer Dashboard.")
            await page.screenshot(path="verification_dashboard.png")
        except Exception as e:
            print(f"Login Error: {e}")
            await page.screenshot(path="error_login.png")

        # 3. Booking & AI Diagnostic
        try:
            print("Navigating to Booking Page...")
            # Button on dashboard might be 'PANGGIL SEKARANG'
            await page.click("button:has-text('PANGGIL SEKARANG')")
            await page.wait_for_url("**/customer/booking**")

            print("Testing AI Diagnostic Flow...")
            await page.fill("input[placeholder='Masukkan alamat lengkap']", "Jl. Sudirman No. 1, Jakarta")

            # Select Brand
            await page.select_option("select#brand", label="Toyota")
            await page.fill("input[placeholder='Avanza, Vario, dll']", "Fortuner")

            # AI Problem Description
            # The placeholder is: 'Tuliskan gejala atau masalah kendaraan Anda (contoh: mesin mati mendadak, aki soak, rem bunyi...)'
            await page.fill("textarea", "mesin saya ngobos dan keluar asap putih dari knalpot")

            print("Clicking AI Diagnostic Button...")
            await page.click("button:has-text('AI DIAGNOSTIC')")

            # Wait for AI result card or success message
            print("Waiting for AI analysis...")
            # The success message is 'Analisa AI Selesai'
            await page.wait_for_selector("text=Analisa AI Selesai", timeout=20000)

            await page.screenshot(path="verification_ai_result.png")
            print("AI Diagnostic verified.")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
