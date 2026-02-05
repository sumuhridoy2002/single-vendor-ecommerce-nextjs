const STORAGE_KEY = "arogga-search-history";
const MAX_ITEMS = 10;

/** Read search history from localStorage. No API call. */
export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

/** Add a query to history: dedupe (move to front if exists), trim to max length, persist. */
export function addToSearchHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  if (typeof window === "undefined") return;
  try {
    const prev = getSearchHistory();
    const next = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/** Clear all search history. */
export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
