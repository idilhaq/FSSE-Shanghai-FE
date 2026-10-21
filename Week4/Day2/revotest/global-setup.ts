import { chromium, type FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Playwright global setup — runs ONCE before the whole test suite.
 *
 * Referenced from playwright.config.ts:
 *   export default defineConfig({
 *     globalSetup: require.resolve('./global-setup'),
 *     use: { storageState: STORAGE_STATE },
 *   });
 *
 * Goal: seed a test user WITHOUT driving the UI, persist a logged-in session,
 * and save it to a storageState file so every test starts already signed in.
 *
 * This app's "API" is the client-side auth layer in app/lib/auth.ts, which is
 * backed by localStorage. So instead of an HTTP POST we seed localStorage
 * directly inside a real browser origin, then export the storage state.
 */

export const STORAGE_STATE = path.join(
    __dirname,
    'playwright',
    '.auth',
    'user.json',
);

const USERS_KEY = 'revoshop.users';
const SESSION_KEY = 'revoshop.session';

export const TEST_USER = {
    username: 'e2e_user',
    email: 'e2e@revou.co',
    password: 'secret123',
};

async function globalSetup(config: FullConfig) {
    // baseURL is where the app is served; the session is scoped to this origin.
    const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:3000';

    // Make sure the directory for the storageState file exists.
    fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // We must be ON the origin before writing localStorage, otherwise the
    // entries would belong to about:blank and never persist for the app.
    await page.goto(baseURL);

    // TODO 1 (real version): register the test user DIRECTLY, bypassing the UI.
    // TODO 2 (real version): store the session so the app sees us as logged in.
    await page.evaluate(
        ({ usersKey, sessionKey, user }) => {
            const raw = window.localStorage.getItem(usersKey);
            const users = raw ? (JSON.parse(raw) as unknown[]) : [];

            const exists = (users as Array<{ email: string }>).some(
                (u) => u.email.toLowerCase() === user.email.toLowerCase(),
            );
            if (!exists) {
                users.push(user);
                window.localStorage.setItem(usersKey, JSON.stringify(users));
            }

            // Start a session for the seeded user (matches auth.ts Session shape).
            window.localStorage.setItem(
                sessionKey,
                JSON.stringify({ username: user.username, email: user.email }),
            );
        },
        { usersKey: USERS_KEY, sessionKey: SESSION_KEY, user: TEST_USER },
    );

    // TODO 3 (real version): save the session so every test can reuse it.
    await context.storageState({ path: STORAGE_STATE });

    await browser.close();
}

export default globalSetup;
