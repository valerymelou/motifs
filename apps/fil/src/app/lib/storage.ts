/**
 * Reads a remembered choice. Storage can be blocked or throw (private
 * windows, cleared site data), so a choice that can't be read is simply
 * not there. Call it in the browser only.
 */
export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Remembers a choice for the next visit, where storage allows it. */
export function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage is blocked: the choice lasts for this visit only.
  }
}
