/**
 * Map technical failures to short, actionable copy for the plugin UI.
 * Never surface raw stack traces or Zod dumps to designers.
 */

export type UiErrorCode =
  | "COLLECT_FAILED"
  | "NO_SELECTION"
  | "SELECT_FAILED"
  | "CATALOG_NETWORK"
  | "CATALOG_INVALID"
  | "STORAGE_FAILED"
  | "CLIPBOARD_FAILED"
  | "UNKNOWN";

const COPY: Record<UiErrorCode, string> = {
  COLLECT_FAILED:
    "Couldn’t read instances from the canvas. Try again, or check a smaller selection.",
  NO_SELECTION:
    "Nothing is selected. Select something on the canvas, then Check selection.",
  SELECT_FAILED:
    "Couldn’t select that layer. It may be on another page or no longer exist.",
  CATALOG_NETWORK:
    "Couldn’t reach the catalog URL. Check the address and network allow-list, or use bundled Canary.",
  CATALOG_INVALID:
    "That catalog pack isn’t valid. Fix the JSON or switch back to bundled Canary.",
  STORAGE_FAILED:
    "Couldn’t save plugin settings on this device. Your session will keep working until you close the plugin.",
  CLIPBOARD_FAILED:
    "Figma blocked clipboard access. The text is below — select it and press ⌘C (Ctrl+C) to copy it by hand.",
  UNKNOWN: "Something went wrong. Try again — if it keeps happening, use Report incorrect check in Support.",
};

export function humanizeError(
  code?: string | null,
  fallbackMessage?: string,
): string {
  if (code && code in COPY) return COPY[code as UiErrorCode];
  // Prefer known human messages; strip overly technical fallbacks
  if (fallbackMessage && !/zod|stack|TypeError|at\s+\//i.test(fallbackMessage)) {
    return fallbackMessage;
  }
  return COPY.UNKNOWN;
}

export function catalogErrorCode(err: unknown): UiErrorCode {
  if (err && typeof err === "object" && "code" in err) {
    const c = (err as { code: string }).code;
    if (c === "CATALOG_NETWORK" || c === "CATALOG_INVALID") return c;
  }
  return "CATALOG_NETWORK";
}
