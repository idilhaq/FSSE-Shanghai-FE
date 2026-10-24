/**
 * Centralized access to environment variables.
 *
 * Two categories matter in Next.js:
 *  - Public  (NEXT_PUBLIC_*): inlined at build time and safe to read in the
 *    browser. Reference them by their full literal name so Next can replace them.
 *  - Server-only: available only in server components / route handlers and
 *    must NOT be sent to the client.
 */

export const publicEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "unknown",
  envName: process.env.NEXT_PUBLIC_ENV_NAME ?? "unknown",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "unset",
} as const;

/** Read only on the server. Never return the raw secret to the client. */
export function getServerEnv() {
  const secret = process.env.APP_SECRET ?? "";
  return {
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    // Expose whether the secret is present and a masked preview only.
    secretLoaded: secret.length > 0,
    secretPreview: secret
      ? `${secret.slice(0, 4)}${"*".repeat(Math.max(secret.length - 4, 0))}`
      : "(not set)",
  };
}
