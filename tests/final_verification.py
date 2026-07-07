
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
            await page.wait_for_selector("text=OKE MEKANIK", timeout=20000)
            await page.screenshot(path="verification_landing.png")
            print("Landing screenshot saved.")
        except Exception as e:
            print(f"Landing Page Error: {e}")

        # 2. Login Page
        try:
            print("Navigating to Login Page...")
            # Try to find the Login button in the header
            login_btn = page.locator("button:has-text('Masuk')").first
            await login_btn.click()
            await page.wait_for_url("**/login", timeout=10000)

            print("Filling Login Form...")
            await page.fill("input[type='email']", "customer@example.com")
            await page.fill("input[type='password']", "password123")

            await page.screenshot(path="verification_login_filled.png")

            # Click Login button
            await page.click("button[type='submit']")

            # Wait for Dashboard
            await page.wait_for_url("**/customer/dashboard", timeout=20000)
            print("Successfully logged in to Customer Dashboard.")
            await page.screenshot(path="verification_dashboard.png")
        except Exception as e:
            print(f"Login Error: {e}")
            await page.screenshot(path="error_login_final.png")

        # 3. Booking & AI Diagnostic
        try:
            print("Navigating to Booking Page...")
            # The button text on dashboard is 'PANGGIL SEKARANG' based on useLanguage 'dashboard.customer.btn_call'
            await page.click("button:has-text('PANGGIL SEKARANG')")
            await page.wait_for_url("**/customer/booking**", timeout=10000)

            print("Testing AI Diagnostic Flow...")
            await page.fill("input[placeholder*='alamat']", "Jl. Sudirman No. 1, Jakarta")

            # AI Problem Description
            await page.fill("textarea", "mesin saya ngobos dan keluar asap putih dari knalpot")

            print("Clicking AI Diagnostic Button...")
            # The button is likely 'AI DIAGNOSTIC' or similar.
            # In BookingPage.tsx it might be different. Let's check BookingPage.tsx
            await page.click("button:has-text('AI DIAGNOSTIC')")

            # Wait for AI result
            print("Waiting for AI analysis...")
            await page.wait_for_selector("text=Analisa AI Selesai", timeout=20000)

            await page.screenshot(path="verification_ai_result.png")
            print("AI Diagnostic verified.")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking_final.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
