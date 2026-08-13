/**
 * Main → UI startup handshake.
 *
 * The main thread runs before the UI iframe finishes loading, so a
 * `plugin-ready` posted at startup can arrive before the UI has a `message`
 * listener and is lost. The UI therefore asks for the handshake itself and
 * retries until the main thread answers.
 */

export type BridgeStatus = "connecting" | "ready" | "error";

export type HandshakeOptions = {
  /** Send UI_READY to the main thread. */
  post: () => void;
  /** Called when the main thread never answered. */
  onGiveUp: () => void;
  intervalMs?: number;
  maxAttempts?: number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (handle: unknown) => void;
};

export type Handshake = {
  /** Stop retrying (call once the main thread replies, or on unmount). */
  stop: () => void;
  attempts: () => number;
};

export function startHandshake({
  post,
  onGiveUp,
  intervalMs = 500,
  maxAttempts = 10,
  setTimer = (fn, ms) => setTimeout(fn, ms),
  clearTimer = (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
}: HandshakeOptions): Handshake {
  let attempts = 0;
  let stopped = false;
  let handle: unknown = null;

  const attempt = () => {
    if (stopped) return;
    attempts += 1;
    post();
    if (attempts >= maxAttempts) {
      stopped = true;
      onGiveUp();
      return;
    }
    handle = setTimer(attempt, intervalMs);
  };

  attempt();

  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      if (handle !== null) clearTimer(handle);
    },
    attempts: () => attempts,
  };
}
