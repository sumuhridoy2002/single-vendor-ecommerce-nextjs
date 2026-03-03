/**
 * Cookie used by middleware to protect account routes.
 * Set from client when user logs in; cleared on logout.
 */

export const ACCOUNT_SESSION_COOKIE = "account_session";

const MAX_AGE_DAYS = 30;

function getCookieOpts(): string {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  return `path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Set account session cookie (client-only). Call after login so middleware can allow /account access.
 */
export function setAccountSessionCookie(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${ACCOUNT_SESSION_COOKIE}=1; ${getCookieOpts()}`;
}

/**
 * Remove account session cookie (client-only). Call on logout.
 */
export function removeAccountSessionCookie(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${ACCOUNT_SESSION_COOKIE}=; path=/; max-age=0`;
}
