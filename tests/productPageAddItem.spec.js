import { test, expect } from "@playwright/test";

test.skip("Product Page Add To Basket", async ({ page }) => {
    await page.goto("/");
    const addToBAsketButton = page.locator('[data-qa="product-button"]').first();
    const basketCounter = page.locator('[data-qa="header-basket-count"]');

    await addToBAsketButton.waitFor();
    await expect(addToBAsketButton).toHaveText("Add to Basket");
    await expect(basketCounter).toHaveText("0");

    await addToBAsketButton.click();
    await expect(addToBAsketButton).toHaveText("Remove from Basket");
    await expect(basketCounter).toHaveText("1");

    const checkoutLink = page.getByRole('link', { name: 'Checkout' });
    await checkoutLink.waitFor();
    await checkoutLink.click();

    await page.waitForURL("/basket")
})