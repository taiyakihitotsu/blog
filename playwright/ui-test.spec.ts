import { expect, test } from "@playwright/test";

test.describe("Floating Jump List UI Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("1. Verify visibility of elements when opening the menu", async ({ page }) => {
    // Wait for the open button to be ready
    const openBtn = page.locator("#float-jump-list-open-button");
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // Use toBeVisible to account for GSAP animation completion
    await expect(page.locator("#float-jump-list-close-modal")).toBeVisible();

    // Verify visibility of the close button (rendered inside contentStyle)
    await expect(page.locator("#float-jump-list-close-button")).toBeVisible();
  });

  test("2. Verify elements are hidden when clicking close button or modal overlay", async ({
    page,
  }) => {
    // Action: Open the list first
    await page.click("#float-jump-list-open-button");

    // Close via close button
    await page.click("#float-jump-list-close-button");
    await expect(page.locator("#float-jump-list-close-modal")).toBeHidden();

    // Action: Open again
    await page.click("#float-jump-list-open-button");

    // Close via modal overlay (clicking the edge to avoid central content)
    // Specifying position to ensure we hit the background overlay
    await page.click("#float-jump-list-close-modal", { position: { x: 10, y: 10 } });
    await expect(page.locator("#float-jump-list-close-modal")).toBeHidden();
  });

  test('4. Verify "Back to Top" (Jump) button scrolls to the top of the page', async ({ page }) => {
    // Preparation: Scroll down the page first
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Note: The actual element ID is float-jump-list-jump-button
    const jumpBtn = page.locator("#float-jump-list-jump-button");
    await jumpBtn.click();

    // GSAP ScrollToPlugin takes time to complete the animation.
    // toPass() will retry the assertion until the scroll position reaches 0.
    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(0);
    }).toPass();
  });

  test("3. Verify all table-of-contents items jump to correct headers", async ({ page }) => {
    await page.click("#float-jump-list-open-button");

    // Get all anchor elements within the table of contents.
    const menuItems = page.locator(".table-of-contents li a");
    const links = await menuItems.all();

    for (const link of links) {
      // Re-open the menu if it was closed by the previous jump.
      if (await page.locator("#float-jump-list-close-modal").isHidden()) {
        await page.click("#float-jump-list-open-button");
      }

      const href = await link.getAttribute("href");
      if (!href || !href.startsWith("#")) continue;

      await link.click();

      // Verify the URL hash matches the target href.
      await expect(page).toHaveURL(new RegExp(`${href}$`));

      // Verify the target element is scrolled into the viewport.
      const targetHeader = page.locator(href);
      await expect(async () => {
        await expect(targetHeader).toBeInViewport();
      }).toPass();

      // Verify the modal is automatically closed after the jump.
      await expect(page.locator("#float-jump-list-close-modal")).toBeHidden();
    }
  });
});
