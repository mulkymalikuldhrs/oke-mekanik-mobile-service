import os
import time
from playwright.sync_api import sync_playwright

def run_marketplace_cuj(page):
    print("Navigating to Store Catalog...")
    page.goto("http://localhost:8080/store/catalog")
    page.wait_for_timeout(1000)

    # Click on product detail button
    buy_buttons = page.get_by_role("button", name="Beli & Bayar")
    if buy_buttons.count() > 0:
        buy_buttons.first.click()
        page.wait_for_timeout(1000)

    # Take screenshot of the marketplace detail & direct payment
    screenshot_path = os.path.join("/home/jules/verification/screenshots", "marketplace.png")
    page.screenshot(path=screenshot_path)
    print(f"Saved screenshot to {screenshot_path}")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_marketplace_cuj(page)
        finally:
            context.close()
            browser.close()
