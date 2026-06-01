
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
            # Using the localized 'Masuk' button
            await page.click("text=Masuk")
            await page.wait_for_url("**/login")

            print("Filling Login Form...")
            await page.fill("input[placeholder='nama@email.com']", "customer@example.com")
            await page.fill("input[placeholder='******']", "password123")

            await page.screenshot(path="verification_login.png")
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
            await page.click("button:has-text('PANGGIL SEKARANG')")
            await page.wait_for_url("**/customer/booking**")

            print("Testing AI Diagnostic Flow (Step 1)...")
            # Problem textarea is available in Step 1
            problem_placeholder = "Contoh: mesin brebet, rem berdecit, aki soak..."
            await page.fill(f"textarea[placeholder='{problem_placeholder}']", "mesin saya ngobos dan keluar asap putih dari knalpot")

            print("Clicking AI Diagnostic Button...")
            # It's a button with a Sparkles icon, likely the only small button next to textarea
            await page.click("button:has(svg.lucide-sparkles)")

            # Wait for AI result card
            print("Waiting for AI analysis...")
            await page.wait_for_selector("text=AI: Tune Up", timeout=20000)
            await page.screenshot(path="verification_ai_result.png")
            print("AI Diagnostic verified.")

            # Continue to Step 2
            await page.click("button:has-text('Lanjutkan')")

            print("Entering Location (Step 2)...")
            # Now address input should be visible
            address_placeholder = "Masukkan alamat lengkap"
            await page.wait_for_selector(f"input[placeholder='{address_placeholder}']")
            await page.fill(f"input[placeholder='{address_placeholder}']", "Jl. Sudirman No. 1, Jakarta")

            await page.screenshot(path="verification_step2.png")
            print("Step 2 verified.")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
