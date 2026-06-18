
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
            # Redirect to booking page directly if needed, or find the right button
            await page.goto("http://localhost:8080/customer/booking")
            await page.wait_for_url("**/customer/booking**")

            print("Testing AI Diagnostic Flow...")
            # Wait for any of the service buttons to be visible to ensure page is loaded
            await page.wait_for_selector("text=Pilih Layanan")

            # Input problem for AI
            await page.fill("textarea[placeholder='Contoh: mesin brebet, rem berdecit, aki soak...']", "mesin saya ngobos dan keluar asap putih dari knalpot")

            print("Clicking AI Diagnostic Button...")
            # Look for the button with the sparkles icon or based on type/position
            # In step 1, the diagnostic button is inside a Card and has no text, only an icon
            await page.locator("button:has(svg.lucide-sparkles)").click()

            # Wait for AI result
            await page.wait_for_selector("text=AI:", timeout=20000)
            print("AI Diagnostic result visible.")

            await page.click("button:has-text('Lanjutkan')")

            # Step 2: Location
            print("Step 2: Location & Vehicle")
            await page.wait_for_selector("text=Lokasi & Kendaraan")
            await page.fill("input[placeholder='Jl. Sudirman No. 1, Jakarta']", "Jl. Sudirman No. 1, Jakarta Central")
            await page.fill("input[placeholder='Avanza, Vario...']", "Fortuner")

            # Detail Masalah
            await page.fill("textarea[placeholder='Jelaskan masalah kendaraan Anda...']", "mesin saya ngobos dan keluar asap putih dari knalpot")

            await page.screenshot(path="verification_booking_step2.png")
            print("Step 2 completed.")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
