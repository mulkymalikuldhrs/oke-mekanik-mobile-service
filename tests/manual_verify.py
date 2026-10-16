from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8080")
    page.wait_for_timeout(1000)

    # Click Masuk Header Link
    page.get_by_role("button", name="Masuk", exact=True).click()
    page.wait_for_timeout(1000)

    # Fill Credentials
    page.get_by_placeholder("nama@email.com").fill("customer@example.com")
    page.get_by_placeholder("******").fill("password123")
    page.wait_for_timeout(500)

    # Submit login form (default role is customer)
    page.locator("form").get_by_role("button", name="MASUK").click()
    page.wait_for_timeout(2500)

    # Capture Customer Dashboard
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

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
