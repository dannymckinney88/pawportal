const INTENT_KEY = "heelflow:focus-intent";

export type FocusIntent = {
  targetId: string;
  fallbackId?: string;
  visible: boolean;
  ts?: number;
};

/**
 * Store an explicit focus intent before a route transition.
 * Call this in the onClick handler of any navigation element.
 */
export function setFocusIntent(intent: FocusIntent): void {
  try {
    sessionStorage.setItem(INTENT_KEY, JSON.stringify({ ...intent, ts: Date.now() }));
  } catch {
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

    const intent = JSON.parse(raw) as FocusIntent;

    if (intent.ts && Date.now() - intent.ts > 3000) {
      clearFocusIntent();
      return null;
    }

    return intent;
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
