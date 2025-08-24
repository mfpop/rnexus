import { test, expect } from "@playwright/test";

test.describe("Dropdown Menu Positioning", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the chat page where dropdowns are used
    await page.goto("/chat");
    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  // Helper to find the more options button with several fallbacks
  const findMoreOptions = async (page: any) => {
    const candidates = [
      '[data-testid="chat-left-more-options"]',
      'button[title="Contact options (left)"]',
      '[data-dropdown-trigger]'
    ];

    for (const sel of candidates) {
      const loc = page.locator(sel).first();
      try {
        await expect(loc).toBeVisible({ timeout: 3000 });
        return loc;
      } catch (e) {
        // continue
      }
    }
    // Last attempt: return the first matching element even if not visible
    return page.locator('[data-dropdown-trigger]').first();
  };

  test("left card dropdown should be properly positioned", async ({ page }) => {
    // Find the more options button in the left card
  const moreOptionsButton = page.locator('[data-testid="chat-left-more-options"]');
    await expect(moreOptionsButton).toBeVisible();

    // Click the more options button to open dropdown
    await moreOptionsButton.click();

    // Wait for dropdown to appear
    const dropdownContent = page.locator(".fixed.z-50").first();
    await expect(dropdownContent).toBeVisible();

  // Get the button position
  const buttonRect = await moreOptionsButton.boundingBox();
  const dropdownRect = await dropdownContent.boundingBox();

  // Translate bounding boxes to top/bottom/left/right
  const buttonTop = buttonRect?.y ?? 0;
  const buttonBottom = (buttonRect?.y ?? 0) + (buttonRect?.height ?? 0);
  const dropdownTop = dropdownRect?.y ?? 0;
  const dropdownLeft = dropdownRect?.x ?? 0;
  const dropdownRight = (dropdownRect?.x ?? 0) + (dropdownRect?.width ?? 0);

  // Verify dropdown is positioned below the button
  expect(dropdownTop).toBeGreaterThan(buttonBottom - 10);

  // Verify dropdown is not off-screen
  expect(dropdownLeft).toBeGreaterThanOrEqual(0);
  expect(dropdownRight).toBeLessThanOrEqual((await page.viewportSize()?.width) || 1920);
  });

  test("right card dropdown should be properly positioned", async ({
    page,
  }) => {
    // Find the more options button in the right card
  const moreOptionsButton = page.locator('[data-testid="message-more-options"]').nth(0);
    await expect(moreOptionsButton).toBeVisible();

    // Click the more options button to open dropdown
    await moreOptionsButton.click();

    // Wait for dropdown to appear
    const dropdownContent = page.locator(".fixed.z-50").first();
    await expect(dropdownContent).toBeVisible();

  // Get the button position
  const buttonRect = await moreOptionsButton.boundingBox();
  const dropdownRect = await dropdownContent.boundingBox();

  const buttonTop2 = buttonRect?.y ?? 0;
  const buttonBottom2 = (buttonRect?.y ?? 0) + (buttonRect?.height ?? 0);
  const dropdownTop2 = dropdownRect?.y ?? 0;
  const dropdownLeft2 = dropdownRect?.x ?? 0;
  const dropdownRight2 = (dropdownRect?.x ?? 0) + (dropdownRect?.width ?? 0);

  // Verify dropdown is positioned below the button
  expect(dropdownTop2).toBeGreaterThan(buttonBottom2 - 10);

  // Verify dropdown is not off-screen
  expect(dropdownLeft2).toBeGreaterThanOrEqual(0);
  expect(dropdownRight2).toBeLessThanOrEqual((await page.viewportSize()?.width) || 1920);
  });

  test("dropdown should reposition when scrolling", async ({ page }) => {
    // Find and click the more options button
  const moreOptionsButton = page.locator('[data-testid="chat-left-more-options"]');
    await moreOptionsButton.click();

    // Wait for dropdown to appear
    const dropdownContent = page.locator(".fixed.z-50").first();
    await expect(dropdownContent).toBeVisible();

  // Get initial position
  const initialPosition = await dropdownContent.boundingBox();

    // Scroll the page
    await page.evaluate(() => window.scrollBy(0, 100));

    // Wait a bit for repositioning
    await page.waitForTimeout(100);

  // Get new position
  const newPosition = await dropdownContent.boundingBox();

  // Position should have changed due to scroll (compare y)
  expect(newPosition?.y).not.toEqual(initialPosition?.y);
  });
});
