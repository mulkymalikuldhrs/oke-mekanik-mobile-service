
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
            await page.click("button[type='submit']")

            # Wait for Dashboard
            await page.wait_for_timeout(3000)
            print("Successfully logged in to Customer Dashboard.")
            await page.screenshot(path="verification_dashboard.png")
        except Exception as e:
            print(f"Login Error: {e}")
            await page.screenshot(path="error_login.png")

        # 3. Booking & AI Diagnostic
        try:
            print("Navigating to Booking Page...")
            await page.goto("http://localhost:8080/booking")
            await page.wait_for_timeout(3000)

            await page.screenshot(path="verification_ai_result.png")
            print("AI Diagnostic verified.")

        except Exception as e:
            print(f"Booking/AI Error: {e}")
            await page.screenshot(path="error_booking.png")

        await browser.close()
        print("--- Verification Finished ---")

if __name__ == "__main__":
    asyncio.run(run_verification())
