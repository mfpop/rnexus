import { test, expect } from "@playwright/test";

test("create activity end-to-end", async ({ page }) => {
  // Prepare a fake activity and intercept backend calls so tests don't depend on real API
  const createdActivity = {
    id: "e2e-test-activity-1",
    title: "E2E Test Activity",
    description: "Created by automated test",
    type: "Projects",
    status: "planned",
    priority: "medium",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    assignedTo: "user-001",
    assignedBy: "user-001",
    location: "",
    progress: 0,
    estimatedDuration: 0,
  };

  await page.route("**/api/activities/**", async (route) => {
    const req = route.request();
    if (req.method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ success: true, activity: createdActivity }),
      });
      return;
    }

    if (req.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, activities: [createdActivity] }),
      });
      return;
    }

    route.continue();
  });

  // Go to activities page
  await page.goto("/activities");

  // Wait for page to load and left card more options
  const createButton = page.getByTestId("leftcard-create-activity").first();
  await expect(createButton).toBeVisible({ timeout: 5000 });

  // Open modal
  await createButton.click();

  // Fill title and description
  await expect(page.getByPlaceholder("Enter activity title")).toBeVisible({
    timeout: 5000,
  });
  await page.fill(
    'input[placeholder="Enter activity title"]',
    "E2E Test Activity",
  );
  await page.fill(
    'textarea[placeholder="Describe the activity"]',
    "Created by automated test",
  );

  // Submit
  await page
    .getByTestId("create-activity-modal")
    .getByRole("button", { name: "Create Activity" })
    .click();

  // Wait for modal to close
  await expect(page.getByTestId("create-activity-modal")).toHaveCount(0, {
    timeout: 5000,
  });

  // Optionally wait for activities list to show new item (approximate)
  await page.waitForTimeout(1000);
  const newItem = page.locator("text=E2E Test Activity");
  await expect(newItem).toBeVisible({ timeout: 5000 });
});
