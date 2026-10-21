import { test, expect } from '@playwright/test';

/**
 * Session reuse via storageState.
 *
 * global-setup.ts seeds the `e2e_user` user and saves a logged-in session to
 * playwright/.auth/user.json. The "Authenticated Chrome" project in
 * playwright.config.ts loads that file via `use: { storageState }`, so this
 * test starts ALREADY signed in — there is NO UI registration or login here.
 */
test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('reuses the saved session without registering through the UI', async ({
    page,
}) => {
    // The navbar reflects the restored session seeded during global setup.
    await expect(page.getByTestId('nav-username')).toBeVisible();
    await expect(page.getByTestId('nav-username')).toHaveText('e2e_user');
});

test('the logout control is available for the restored session', async ({
    page,
}) => {
    await expect(page.getByTestId('nav-logout')).toBeVisible();

    // Logging out clears the session and sends the user to /login.
    await page.getByTestId('nav-logout').click();
    await expect(page).toHaveURL(/\/login$/);
});
