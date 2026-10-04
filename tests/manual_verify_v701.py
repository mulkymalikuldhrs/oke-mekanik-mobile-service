
from playwright.sync_api import sync_playwright
import glob
import os

def run_cuj(page):
    page.goto("http://localhost:8080")
    page.wait_for_timeout(1000)

    # Click login link/button if present or navigate to login
    page.goto("http://localhost:8080/login")
    page.wait_for_timeout(1000)

    # Take login screenshot
    page.screenshot(path="/home/jules/verification/screenshots/login.png")

    # Navigate back to home
    page.goto("http://localhost:8080/")
    page.wait_for_timeout(1000)

    # Take landing page screenshot
    page.screenshot(path="/home/jules/verification/screenshots/landing.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
