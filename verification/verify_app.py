from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Go to home page
            page.goto("http://localhost:3000")

            # Wait for the grid to appear
            page.wait_for_selector("text=CoT Visualizer")

            # Take screenshot of landing page
            page.screenshot(path="verification/landing_page.png")
            print("Landing page screenshot taken.")

            # Click on a challenge
            page.click("text=Arithmetic")

            # Wait for arena to load
            page.wait_for_selector("text=Run Simulation")

            # Take screenshot of arena
            page.screenshot(path="verification/arena_page.png")
            print("Arena page screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
