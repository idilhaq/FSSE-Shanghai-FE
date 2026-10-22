import { test, expect } from '@playwright/test';

test('products page renders the mocked products', async ({ page }) => {
  // 1) Intercept GET /api/products and fulfill it with a mocked list of TWO
  //    products BEFORE navigating, so the page never hits the real backend.
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Laptop', price: 5000000 },
        { id: 2, name: 'Keyboard', price: 350000 },
      ]),
    });
  });

  await page.goto('http://localhost:3000/products');

  // 2) Assert product-1 is visible and has text 'Laptop', and product-2 is visible.
  // api is working and return data, then render the product card
  const product1 = page.getByTestId('product-1');
  await expect(product1).toBeVisible();
  await expect(product1).toContainText('Laptop');

  // ensure product card is equal to product returned by api
  await expect(page.getByTestId('product-2')).toBeVisible();
  await expect(page.getByTestId('product-2')).toContainText('Keyboard');

  await page.goto('http://localhost:3000/products');
});

test('products page failed to render products', async ({ page }) => {
  // 1) Intercept GET /api/products and fulfill it with a mocked list of TWO
  //    products BEFORE navigating, so the page never hits the real backend.
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Laptop', price: 5000000 },
        { id: 2, name: 'Keyboard', price: 350000 },
      ]),
    });
  });

  await page.goto('http://localhost:3000/products');

  // 2) Assert product-1 is visible and has text 'Laptop', and product-2 is visible.
  // api is working and return data, then render the product card
  const product1 = page.getByTestId('product-1');
  await expect(product1).toBeHidden();
});
