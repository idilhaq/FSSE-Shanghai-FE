import { test, expect } from '@playwright/test';

test('a user can register, log in, and log out', async ({ page }) => {
    // --- Register ---
    await page.goto('/register');

    await page.getByTestId('username-input').fill('revouser');
    await page.getByTestId('email-input').fill('revouser@revou.co');
    await page.getByTestId('password-input').fill('secret123');
    await page.getByTestId('confirm-password-input').fill('secret123');

    await page.getByTestId('register-submit').click();

    // Registration should redirect to login.
    await expect(page).toHaveURL('/login');

    // --- Login ---
    await page.getByTestId('email-input').fill('revouser@revou.co');
    await page.getByTestId('password-input').fill('secret123');
    await page.getByTestId('login-submit').click();

    // Verify successful login and displayed username.
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('nav-username')).toHaveText('revouser');

    // --- Logout ---
    await page.getByTestId('nav-logout').click();

    // Verify logout redirects to login and removes the username.
    await expect(page).toHaveURL('/login');
    await expect(page.getByTestId('nav-username')).toBeHidden();
});
