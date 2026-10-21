import { test, expect } from '@playwright/test';

/**
 * End-to-end auth flow:
 *   register -> login (same email/password) -> username shows -> logout -> /login
 *
 * Auth is a demo implementation backed by localStorage, so each test uses a
 * unique email to stay isolated and runs against a fresh browser context.
 */
test('registers, logs in, shows the username, then logs out to /login', async ({
    page,
}) => {
    const unique = Date.now();
    const username = `revouser_${unique}`;
    const email = `revouser_${unique}@revou.co`;
    const password = 'secret123';

    // 1. Register a new user. Scope to the register form so locators stay
    // unambiguous even while a soft navigation briefly keeps both pages mounted.
    await page.goto('/register');
    const registerForm = page.getByTestId('register-form');
    await expect(registerForm).toBeVisible();
    await registerForm.getByTestId('username-input').fill(username);
    await registerForm.getByTestId('email-input').fill(email);
    await registerForm.getByTestId('password-input').fill(password);
    await registerForm.getByTestId('confirm-password-input').fill(password);

    await registerForm.getByTestId('register-submit').click();

    await expect(registerForm.getByTestId('register-success')).toHaveText('Validation successful! Your form is ready to submit.')

    // Successful registration redirects to the login page (after a 5s delay).
    await expect(page).toHaveURL(/\/login$/, { timeout: 10000 });

    // 2. Log in with the same email/password.
    const loginForm = page.getByTestId('login-form');
    await expect(loginForm).toBeVisible();
    await loginForm.getByTestId('email-input').fill(email);
    await loginForm.getByTestId('password-input').fill(password);
    await loginForm.getByTestId('login-submit').click();

    // Successful login redirects to the dashboard.
    await expect(page).toHaveURL(/\/dashboard$/);

    // 3. The username is shown.
    await expect(page.getByTestId('username')).toHaveText(username);

    // 4. Log out and assert redirect back to /login.
    await page.getByTestId('logout-button').click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-form')).toBeVisible();
});

test('visiting the dashboard without a session redirects to /login', async ({
    page,
}) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
});

test('logging in with unknown credentials shows an error', async ({ page }) => {
    await page.goto('/login');
    const loginForm = page.getByTestId('login-form');
    await loginForm.getByTestId('email-input').fill('nobody@revou.co');
    await loginForm.getByTestId('password-input').fill('wrongpassword');
    await loginForm.getByTestId('login-submit').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
});
