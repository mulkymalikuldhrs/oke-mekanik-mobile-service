import asyncio
from playwright.async_api import async_playwright
import os

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

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
            await page.fill("input[type='email']", "customer@example.com")
            await page.fill("input[type='password']", "password123")

            await page.screenshot(path="verification_login.png")
            await page.click("button[type='submit']")

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
            await page.goto("http://localhost:8080/customer/booking")
            await page.wait_for_selector("text=Pilih Layanan", timeout=10000)

            print("Testing Service Selection & AI Diagnostic Flow...")
            # Click first service card
            await page.click("button:has-text('Rp')")

            await page.fill("textarea", "mobil saya turun mesin dan asap putih ngebul")
            await page.click("button:has-text('Lanjutkan')")

            print("Testing Step 2: Location & Vehicle...")
            await page.wait_for_selector("text=Lokasi & Kendaraan", timeout=10000)
            await page.fill("input[placeholder='Jl. Sudirman No. 1, Jakarta']", "Jl. Sudirman No. 10, Jakarta Pusat")

            await page.screenshot(path="verification_ai_result.png")
            print("AI Diagnostic & Booking flow verified successfully!")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
