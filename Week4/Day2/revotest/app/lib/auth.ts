'use client';

// Demo-only client-side auth backed by localStorage.
// This is NOT secure and exists purely so the register -> login -> dashboard
// -> logout flow works end-to-end for development and tests.

export type StoredUser = {
    username: string;
    email: string;
    password: string;
};

export type Session = {
    username: string;
    email: string;
};

const USERS_KEY = 'revoshop.users';
const SESSION_KEY = 'revoshop.session';

function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

function readUsers(): StoredUser[] {
    if (!isBrowser()) return [];
    try {
        const raw = window.localStorage.getItem(USERS_KEY);
        return raw ? (JSON.parse(raw) as StoredUser[]) : [];
    } catch {
        return [];
    }
}

function writeUsers(users: StoredUser[]): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Register a new user. Returns an error message when the email is already
 * taken, otherwise null on success.
 */
export function registerUser(user: StoredUser): string | null {
    const users = readUsers();
    const exists = users.some(
        (existing) => existing.email.toLowerCase() === user.email.toLowerCase(),
    );

    if (exists) {
        return 'An account with this email already exists.';
    }

    users.push(user);
    writeUsers(users);
    return null;
}

/**
 * Verify credentials and start a session. Returns an error message on failure,
 * otherwise null on success.
 */
export function loginUser(email: string, password: string): string | null {
    const users = readUsers();
    const match = users.find(
        (existing) =>
            existing.email.toLowerCase() === email.toLowerCase() &&
            existing.password === password,
    );

    if (!match) {
        return 'Invalid email or password.';
    }

    const session: Session = { username: match.username, email: match.email };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return null;
}

export function getSession(): Session | null {
    if (!isBrowser()) return null;
    try {
        const raw = window.localStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
        return null;
    }
}

export function logout(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(SESSION_KEY);
}
