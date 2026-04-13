const INTENT_KEY = "heelflow:focus-intent";

export type FocusIntent = {
  /** id of the primary element to focus. */
  targetId: string;
  /**
   * id of the fallback element to focus when targetId is not found.
   * Used for restore flows where the originating card may be absent.
   */
  fallbackId?: string;
  /**
   * true  — keyboard-triggered navigation: apply visible landing ring.
   * false — pointer-triggered navigation: focus silently (no ring).
   */
  visible: boolean;
};

/**
 * Store an explicit focus intent before a route transition.
 * Call this in the onClick handler of any navigation element.
 */
export function setFocusIntent(intent: FocusIntent): void {
  try {
    sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent));
  } catch {
    // sessionStorage unavailable — focus restoration simply won't happen
    console.warn("[focus-intent] setFocusIntent failed — sessionStorage unavailable");
  }
}

/**
 * Read the stored focus intent WITHOUT clearing it.
 * Use this when the consumer needs to retry; pair with clearFocusIntent().
 */
export function peekFocusIntent(): FocusIntent | null {
  try {
    const raw = sessionStorage.getItem(INTENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FocusIntent;
  } catch {
    return null;
  }
}

/**
 * Clear the stored focus intent.
 * Call this after successfully resolving focus, or after retries are exhausted.
 */
export function clearFocusIntent(): void {
  try {
    sessionStorage.removeItem(INTENT_KEY);
  } catch {}
}
