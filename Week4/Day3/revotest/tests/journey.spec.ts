import { test, expect } from '@playwright/test';

test('a shopper can browse and check out', async ({ page }) => {
  // --- given: mock the products API, then load the list ---
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
  await expect(page.getByTestId('product-1')).toBeVisible();

  // --- open the product detail page ---
  // 1) click product-1, then assert the URL is /products/1
  await page.getByTestId('product-1').click();
  await expect(page).toHaveURL('http://localhost:3000/products/1');
  await expect(page.getByTestId('product-detail-1')).toContainText('Laptop');

  // --- add it to the cart ---
  // 2) click add-to-cart, then assert cart-badge shows '1'
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-badge')).toHaveText('1');

  // --- review the cart ---
  // 3) click cart-link, assert URL is /cart and cart-item-1 is visible
  await page.getByTestId('cart-link').click();
  await expect(page).toHaveURL('http://localhost:3000/cart');
  await expect(page.getByTestId('cart-item-1')).toBeVisible();

  // --- check out and place the order ---
  // 4) click checkout-button, assert URL is /checkout; place the order,
  //    then assert order-success is visible
  await page.getByTestId('checkout-button').click();
  await expect(page).toHaveURL('http://localhost:3000/checkout');

  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
});
