/**
 * Levenshtein edit distance between two strings.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j]! + 1, // deletion
        curr[j - 1]! + 1, // insertion
        prev[j - 1]! + cost, // substitution
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]!;
  }

  return prev[b.length]!;
}

/**
 * Suggest the closest allowed catalog value for a typo.
 * Returns null when distance > threshold, or when actual is already allowed.
 */
export function suggestClosestValue(
  actual: string,
  allowed: string[],
  threshold = 2,
): string | null {
  if (allowed.includes(actual)) return null;

  let best: string | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const candidate of allowed) {
    const d = levenshtein(actual.toLowerCase(), candidate.toLowerCase());
    if (d < bestDist) {
      bestDist = d;
      best = candidate;
    }
  }

  if (best === null || bestDist > threshold) return null;
  return best;
}
