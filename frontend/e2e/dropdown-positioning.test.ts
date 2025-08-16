import { test, expect } from "@playwright/test";

test.describe("Dropdown Menu Positioning", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the chat page where dropdowns are used
    await page.goto("/chat");
    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  test("left card dropdown should be properly positioned", async ({ page }) => {
    // Find the more options button in the left card
    const moreOptionsButton = page.locator("[data-dropdown-trigger]").first();
    await expect(moreOptionsButton).toBeVisible();

    // Click the more options button to open dropdown
    await moreOptionsButton.click();

    // Wait for dropdown to appear
    const dropdownContent = page.locator(".fixed.z-50").first();
    await expect(dropdownContent).toBeVisible();

    // Get the button position
    const buttonRect = await moreOptionsButton.boundingBox();
    const dropdownRect = await dropdownContent.boundingBox();

    // Verify dropdown is positioned below the button
    expect(dropdownRect?.top).toBeGreaterThan((buttonRect?.bottom || 0) - 10);

    // Verify dropdown is not off-screen
    expect(dropdownRect?.left).toBeGreaterThanOrEqual(0);
    expect(dropdownRect?.right || 0).toBeLessThanOrEqual(
      (await page.viewportSize()?.width) || 1920,
    );
  });

  test("right card dropdown should be properly positioned", async ({
    page,
  }) => {
    // Find the more options button in the right card
    const moreOptionsButton = page.locator("[data-dropdown-trigger]").nth(1);
    await expect(moreOptionsButton).toBeVisible();

    // Click the more options button to open dropdown
    await moreOptionsButton.click();

    // Wait for dropdown to appear
    const dropdownContent = page.locator(".fixed.z-50").first();
    await expect(dropdownContent).toBeVisible();

    // Get the button position
    const buttonRect = await moreOptionsButton.boundingBox();
    const dropdownRect = await dropdownContent.boundingBox();

    // Verify dropdown is positioned below the button
    expect(dropdownRect?.top).toBeGreaterThan((buttonRect?.bottom || 0) - 10);

    // Verify dropdown is not off-screen
    expect(dropdownRect?.left).toBeGreaterThanOrEqual(0);
    expect(dropdownRect?.right || 0).toBeLessThanOrEqual(
      (await page.viewportSize()?.width) || 1920,
    );
  });

  test("dropdown should reposition when scrolling", async ({ page }) => {
    // Find and click the more options button
    const moreOptionsButton = page.locator("[data-dropdown-trigger]").first();
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

    // Position should have changed due to scroll
    expect(newPosition?.top).not.toEqual(initialPosition?.top);
  });
});
