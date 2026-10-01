import asyncio
from playwright.async_api import async_playwright

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

            # Click submit button
            await page.click("button[type='submit']")

            # Wait for Navigation or state change
            await asyncio.sleep(2)
            await page.screenshot(path="verification_dashboard.png")
            print("Successfully processed login.")
        except Exception as e:
            print(f"Login Error: {e}")
            await page.screenshot(path="error_login.png")

        # 3. Booking & Direct Navigation Test
        try:
            print("Navigating to Booking Page...")
            await page.goto("http://localhost:8080/customer/booking", timeout=15000)
            await asyncio.sleep(2)

            print("Testing AI Diagnostic Area...")
            await page.screenshot(path="verification_ai_result.png")
            print("Booking/AI Area verified.")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
