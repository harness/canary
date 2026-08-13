import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { startHandshake } from "../src/ui/lib/handshake";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("startHandshake", () => {
  it("asks for the handshake immediately", () => {
    const post = vi.fn();
    startHandshake({ post, onGiveUp: vi.fn() }).stop();
    expect(post).toHaveBeenCalledTimes(1);
  });

  it("retries until the main thread replies", () => {
    const post = vi.fn();
    const onGiveUp = vi.fn();
    const hs = startHandshake({ post, onGiveUp, intervalMs: 500 });

    vi.advanceTimersByTime(1_100);
    expect(post).toHaveBeenCalledTimes(3);

    hs.stop();
    vi.advanceTimersByTime(5_000);
    expect(post).toHaveBeenCalledTimes(3);
    expect(onGiveUp).not.toHaveBeenCalled();
  });

  it("gives up after maxAttempts so the UI can show an error state", () => {
    const post = vi.fn();
    const onGiveUp = vi.fn();
    startHandshake({ post, onGiveUp, intervalMs: 100, maxAttempts: 3 });

    vi.advanceTimersByTime(1_000);
    expect(post).toHaveBeenCalledTimes(3);
    expect(onGiveUp).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1_000);
    expect(post).toHaveBeenCalledTimes(3);
    expect(onGiveUp).toHaveBeenCalledTimes(1);
  });

  it("is safe to stop twice", () => {
    const hs = startHandshake({ post: vi.fn(), onGiveUp: vi.fn() });
    hs.stop();
    expect(() => hs.stop()).not.toThrow();
    expect(hs.attempts()).toBe(1);
  });
});
