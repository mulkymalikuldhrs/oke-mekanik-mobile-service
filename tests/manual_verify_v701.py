import os
import json
import urllib.request
from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to Landing Page
    page.goto("http://localhost:8080")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/landing_v701.png")

    # Get auth token directly via API call
    req = urllib.request.Request(
        'http://localhost:8080/api/auth/login',
        data=json.dumps({'email': 'customer@example.com', 'password': 'password123', 'role': 'customer'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req)
    data = json.loads(res.read().decode())
    token = data['token']
    user = data['user']

    # Set auth in page local storage
    page.add_init_script(f"""
        localStorage.setItem('auth_token', {json.dumps(token)});
        localStorage.setItem('auth_user', {json.dumps(json.dumps(user))});
    """)

    # Navigate directly to Customer Dashboard
    page.goto("http://localhost:8080/customer/dashboard")
    page.wait_for_timeout(2000)

    # Take dashboard screenshot
    page.screenshot(path="/home/jules/verification/screenshots/dashboard_v701.png")
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
