// Centralized, env-driven auth/session configuration.
// Kept server-side (no NEXT_PUBLIC_ prefix) so the token scheme isn't exposed to the client bundle.

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'session_token';

// Prefix used to build the opaque session token, e.g. `token-for-admin`.
export const SESSION_TOKEN_PREFIX = process.env.SESSION_TOKEN_PREFIX ?? 'token-for-';

// Session lifetime in seconds (defaults to 1 hour).
export const SESSION_MAX_AGE_SECONDS = Number(process.env.SESSION_MAX_AGE_SECONDS ?? 3600);

export function buildSessionToken(role: string): string {
    return `${SESSION_TOKEN_PREFIX}${role}`;
}

export const ADMIN_SESSION_TOKEN = buildSessionToken('admin');
