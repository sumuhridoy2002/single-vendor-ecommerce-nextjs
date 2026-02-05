/**
 * Cookie utility functions for managing browser cookies
 */

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

/**
 * Set a cookie with optional expiration
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 7)
 * @param options - Additional cookie options
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 7,
  options?: {
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }
): void {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const path = options?.path || '/';
  const domain = options?.domain ? `;domain=${options.domain}` : '';
  const secure = options?.secure !== undefined
    ? options.secure
    : process.env.NODE_ENV === 'production';
  const secureFlag = secure ? ';Secure' : '';
  const sameSite = options?.sameSite || 'Lax';
  const sameSiteFlag = `;SameSite=${sameSite}`;

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}${domain}${secureFlag}${sameSiteFlag}`;
}

/**
 * Remove a cookie
 * @param name - Cookie name
 * @param options - Cookie options (path, domain) to match when removing
 */
export function removeCookie(
  name: string,
  options?: {
    path?: string;
    domain?: string;
  }
): void {
  if (typeof document === 'undefined') return;

  const path = options?.path || '/';
  const domain = options?.domain ? `;domain=${options.domain}` : '';

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}${domain}`;
}

/**
 * Check if a cookie exists
 * @param name - Cookie name
 * @returns True if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Get all cookies as an object
 * @returns Object with cookie names as keys and values as values
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};

  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;

  if (cookieString) {
    cookieString.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
}

/**
 * Clear all cookies (use with caution)
 */
export function clearAllCookies(): void {
  if (typeof document === 'undefined') return;

  const cookies = getAllCookies();
  Object.keys(cookies).forEach((name) => {
    removeCookie(name);
  });
}
