/**
 * Copying text out of a Figma plugin UI.
 *
 * The plugin UI runs in a cross-origin, sandboxed iframe. Figma does not
 * delegate the `clipboard-write` Permissions Policy to it, so
 * `navigator.clipboard.writeText` rejects with NotAllowedError in Chrome and
 * in the desktop app even though the click is a genuine user gesture. The
 * legacy `document.execCommand("copy")` path is not gated by that policy — it
 * only needs a selected text node in a document that still holds user
 * activation — so it is the reliable path here.
 *
 * Both attempts must stay inside the gesture's task: call `copyText` directly
 * from the click handler and never behind a timer or a network round-trip.
 */

import { humanizeError } from "./errors";
import { okToast, warnToast, type Toast } from "./toast";

export type CopyMethod = "async-api" | "exec-command" | "none";

export type CopyOutcome = {
  ok: boolean;
  method: CopyMethod;
};

export async function copyText(text: string): Promise<CopyOutcome> {
  if (await writeViaClipboardApi(text)) {
    return { ok: true, method: "async-api" };
  }
  if (writeViaExecCommand(text)) {
    return { ok: true, method: "exec-command" };
  }
  return { ok: false, method: "none" };
}

async function writeViaClipboardApi(text: string): Promise<boolean> {
  const write = globalThis.navigator?.clipboard?.writeText;
  if (typeof write !== "function") return false;
  try {
    await write.call(navigator.clipboard, text);
    return true;
  } catch {
    return false;
  }
}

function writeViaExecCommand(text: string): boolean {
  if (typeof document === "undefined") return false;
  if (typeof document.execCommand !== "function") return false;

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.setAttribute("aria-hidden", "true");
  ta.setAttribute("tabindex", "-1");
  // Must stay rendered — execCommand ignores `display: none` and `hidden`
  // nodes — so park it off-screen instead of hiding it.
  ta.style.position = "fixed";
  ta.style.top = "0";
  ta.style.left = "-9999px";
  ta.style.opacity = "0";

  const previous = document.activeElement as HTMLElement | null;
  document.body.appendChild(ta);
  try {
    ta.focus({ preventScroll: true });
    ta.select();
    ta.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    ta.remove();
    previous?.focus?.();
  }
}

/**
 * A blocked clipboard is a warning, not a success: the user still has to copy
 * the text by hand from the fallback field we show them.
 */
export function copyToast(outcome: CopyOutcome, successMessage: string): Toast {
  return outcome.ok
    ? okToast(successMessage)
    : warnToast(humanizeError("CLIPBOARD_FAILED"));
}
