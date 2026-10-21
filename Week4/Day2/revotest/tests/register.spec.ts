import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/register');
});

test('empty form shows every required-field error', async ({ page }) => {
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('username-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toBeVisible();
});

test('invalid email shows the email error', async ({ page }) => {
    await page.getByTestId('username-input').fill('revouser');
    await page.getByTestId('email-input').fill('not-an-email');
    await page.getByTestId('password-input').fill('secret123');
    await page.getByTestId('confirm-password-input').fill('secret123');

    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('email-error')).toBeVisible();
});

test('mismatched passwords show the confirm-password error', async ({
    page,
}) => {
    await page.getByTestId('username-input').fill('revouser');
    await page.getByTestId('email-input').fill('revouser@revou.co');
    await page.getByTestId('password-input').fill('secret123');
    await page.getByTestId('confirm-password-input').fill('secret999');

    await page.getByTestId('register-submit').click();

    await expect(
        page.getByTestId('confirm-password-error'),
    ).toBeVisible();
});

test('errors clear as the user corrects each field and do submit successfuly', async ({ page }) => {
    await page.getByTestId('register-submit').click();

    // Correct the username.
    await page.getByTestId('username-input').fill('revouser');
    await expect(page.getByTestId('username-error')).toBeHidden();

    // Correct the email.
    await page.getByTestId('email-input').fill('revouser@revou.co');
    await expect(page.getByTestId('email-error')).toBeHidden();

    // Correct the password and confirmation.
    await page.getByTestId('password-input').fill('secret123');
    await expect(page.getByTestId('password-error')).toBeHidden();
    await expect(
        page.getByTestId('confirm-password-error'),
    ).toBeVisible();

    await page.getByTestId('confirm-password-input').fill('secret123');
    await expect(
        page.getByTestId('confirm-password-error'),
    ).toBeHidden();

    await page.getByTestId('register-submit').click();
});
