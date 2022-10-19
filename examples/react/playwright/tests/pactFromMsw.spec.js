import { expect, test } from "./test";

test('should record a msw interaction and turn it into a back', async ({ page }) => {
  await page.fill('#input-product-search', 'Gem Visa');
  await page.click('.btn');

  await expect(page).toHaveURL(new RegExp('(.+)/products/09'));
});

