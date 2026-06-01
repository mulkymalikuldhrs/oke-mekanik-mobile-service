
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

        # 3. Booking & AI Diagnostic (4-Step Wizard)
        try:
            print("Navigating to Booking Page...")
            await page.click("button:has-text('PANGGIL SEKARANG')")
            await page.wait_for_url("**/customer/booking**")

            # Step 1: Select Service / AI
            print("Step 1: Testing AI Diagnostic...")
            await page.fill("textarea", "mesin saya ngobos dan keluar asap putih dari knalpot")
            await page.click("button:has-text('AI')") # Clicking the AI button (BrainCircuit/Sparkles icon button)

            await page.wait_for_selector("text=AI:", timeout=10000)
            print("AI suggestion received.")

            await page.click("button:has-text('Lanjutkan')")

            # Step 2: Location & Vehicle
            print("Step 2: Filling Location & Vehicle...")
            await page.fill("input[placeholder='Jl. Sudirman No. 1, Jakarta']", "Jl. Thamrin No. 10, Jakarta")

            # Select Brand (it's a native select in the code)
            await page.select_option("select", label="Toyota")
            await page.fill("input[placeholder='Avanza, Vario...']", "Fortuner")
            await page.fill("input[placeholder='2020']", "2022")
            await page.fill("input[placeholder='B 1234 XY']", "B 9999 OK")

            await page.click("button:has-text('Cari Mekanik')")

            # Step 3: Choose Mechanic
            print("Step 3: Choosing Mechanic (Auto-Assign)...")
            await page.click("text=Auto-Assign")
            await page.click("button:has-text('Pesan Sekarang (Auto)')")

            # Step 4: Confirmation
            print("Step 4: Confirming Order...")
            await page.wait_for_selector("text=Konfirmasi Pesanan")
            await page.screenshot(path="verification_confirmation.png")

            await page.click("button:has-text('KONFIRMASI PESANAN')")

            # Final: Tracking
            await page.wait_for_url("**/customer/tracking/**", timeout=15000)
            print("Booking flow verified successfully.")
            await page.screenshot(path="verification_tracking.png")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
