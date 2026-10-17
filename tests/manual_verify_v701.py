import os
from playwright.sync_api import sync_playwright, expect

def run():
    os.makedirs("/home/jules/verification", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Landing Page
        page.goto("http://localhost:8080")
        page.wait_for_timeout(2000)
        page.screenshot(path="/home/jules/verification/v701_landing.png")
        print("Captured landing page")

        # 2. Login Page
        page.goto("http://localhost:8080/login")
        page.wait_for_timeout(1000)
        page.get_by_placeholder("nama@email.com").fill("customer@example.com")
        page.get_by_placeholder("******").fill("password123")
        page.screenshot(path="/home/jules/verification/v701_login_page.png")
        print("Captured login page")

        browser.close()

if __name__ == "__main__":
    run()
