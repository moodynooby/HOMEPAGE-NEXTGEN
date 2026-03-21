import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Connect to dev server (assuming it is running on 5173)
        try:
            await page.goto('http://localhost:5173', timeout=10000)
            print("Successfully loaded the landing page.")
        except Exception as e:
            print(f"Failed to load the landing page: {e}")
            await browser.close()
            return

        # Wait for fonts to load
        await page.wait_for_timeout(2000)

        # Create verification directory
        os.makedirs('/home/jules/verification', exist_ok=True)

        # Screenshot the Landing Page (Editorial Style)
        await page.screenshot(path='/home/jules/verification/editorial_landing_v2.png')
        print("Captured: /home/jules/verification/editorial_landing_v2.png")

        # Test navigation to "The Portfolio"
        portfolio_link = page.get_by_role("button", name="The Portfolio")
        if await portfolio_link.is_visible():
            await portfolio_link.click()
            await page.wait_for_timeout(1000)
            await page.screenshot(path='/home/jules/verification/editorial_portfolio.png')
            print("Captured: /home/jules/verification/editorial_portfolio.png")
        else:
            print("Button 'The Portfolio' not found by role. Trying alternate selector...")
            # Fallback to text search
            await page.click("text=The Portfolio")
            await page.wait_for_timeout(1000)
            await page.screenshot(path='/home/jules/verification/editorial_portfolio_fallback.png')
            print("Captured: /home/jules/verification/editorial_portfolio_fallback.png")

        # Switch to Dark Mode
        dark_toggle = page.locator('button[value="dark"]')
        if await dark_toggle.is_visible():
            await dark_toggle.click()
            await page.wait_for_timeout(1000)
            await page.screenshot(path='/home/jules/verification/editorial_dark_mode.png')
            print("Captured: /home/jules/verification/editorial_dark_mode.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
