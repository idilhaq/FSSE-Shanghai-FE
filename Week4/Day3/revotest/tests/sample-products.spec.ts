import { test, expect } from '@playwright/test';

/**
 * This spec covers two DIFFERENT mocking situations around the SAME API path
 * (/api/sample-products):
 *
 *   1. GET  — the product list, fetched on the SERVER (React Server
 *             Component). KEY POINT: page.route() intercepts requests made by
 *             the BROWSER only. A fetch that runs inside an RSC happens in the
 *             Next.js Node process, so page.route() CANNOT see or mock it.
 *             Instead we control the server's data source through an env var
 *             the Playwright webServer sets (see playwright.config.ts).
 *
 *   2. POST — "Add to cart", fired from the BROWSER on click. This one page.
 *             route() CAN intercept. GET and POST share the path, so we split
 *             them with route.request().method().
 */

// These MUST match playwright.config.ts -> webServer.env.SAMPLE_PRODUCTS_JSON,
// because that env var is what the server component actually renders.
const SERVER_PRODUCTS = [
  { id: 101, name: 'Mock Desk', price: 1990000 },
  { id: 102, name: 'Mock Chair', price: 2490000 },
];

// ---------------------------------------------------------------------------
// 1) Mocking the SERVER-SIDE GET (via the env seam, NOT page.route)
// ---------------------------------------------------------------------------
test('server-rendered list shows the mocked products', async ({ page }) => {
  // No page.route() here on purpose: the list is fetched during server
  // rendering, so the browser never makes that request. The mock data comes
  // from SAMPLE_PRODUCTS_JSON, injected into the dev server by the config.
  await page.goto('http://localhost:3000/sample-products');

  await expect(page.getByTestId('sample-product-101')).toBeVisible();
  await expect(page.getByTestId('sample-product-101')).toContainText('Mock Desk');
  await expect(page.getByTestId('sample-product-102')).toContainText('Mock Chair');
});

// Demonstrates WHY page.route() does not work for the server fetch: even with
// an intercept registered, the server-rendered list is unaffected because the
// request never leaves the Node process.
test('page.route() does NOT affect the server-rendered list', async ({ page }) => {
  await page.route('**/api/sample-products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 999, name: 'Should Not Appear', price: 1 }]),
    });
  });

  await page.goto('http://localhost:3000/sample-products');

  // The env-seeded data wins; the page.route() body is ignored for the RSC.
  await expect(page.getByTestId('sample-product-101')).toContainText('Mock Desk');
  await expect(page.getByTestId('sample-product-999')).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// 2) Mocking the CLIENT-SIDE POST — same path, split by method
// ---------------------------------------------------------------------------
test('add to cart posts and the UI confirms', async ({ page }) => {
  // A single handler for the shared path. Branch on the HTTP method so the
  // GET (if the browser ever made one) and the POST each get a response.
  await page.route('**/api/sample-products', async (route) => {
    const request = route.request();

    if (request.method() === 'POST') {
      // Assert the client sent the right payload.
      expect(request.postDataJSON()).toEqual({ productId: 101 });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          message: 'Mock Desk added to cart',
          cartCount: 1,
        }),
      });
      return;
    }

    // Any non-POST hitting the browser network falls through to the real
    // handler so server behavior is unchanged.
    await route.fallback();
  });

  await page.goto('http://localhost:3000/sample-products');
  await expect(page.getByTestId('sample-product-101')).toBeVisible();

  await page.getByTestId('sample-add-to-cart-101').click();

  await expect(page.getByTestId('sample-add-success-101')).toBeVisible();
  await expect(page.getByTestId('sample-add-success-101')).toContainText(
    'Mock Desk added to cart'
  );
});

// ---------------------------------------------------------------------------
// Alternative style: a POST-only handler registered after a catch-all.
// Playwright checks the MOST RECENTLY registered route first, so the POST
// handler wins for POST and uses route.fallback() otherwise.
// ---------------------------------------------------------------------------
test('add to cart — POST-only handler with fallback', async ({ page }) => {
  await page.route('**/api/sample-products', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        message: 'Mock Desk added to cart',
        cartCount: 1,
      }),
    });
  });

  await page.goto('http://localhost:3000/sample-products');
  await page.getByTestId('sample-add-to-cart-101').click();

  await expect(page.getByTestId('sample-add-success-101')).toContainText(
    'Mock Desk added to cart'
  );
});

// ---------------------------------------------------------------------------
// Mocking a FAILED POST so you can test the error branch.
// ---------------------------------------------------------------------------
test('add to cart shows an error when the POST fails', async ({ page }) => {
  await page.route('**/api/sample-products', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, message: 'Server error' }),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto('http://localhost:3000/sample-products');
  await page.getByTestId('sample-add-to-cart-101').click();

  await expect(page.getByTestId('sample-add-error-101')).toBeVisible();
});
