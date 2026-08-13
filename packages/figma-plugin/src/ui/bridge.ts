import type { MainEvent, UiRequest } from "../main/messages";

export function postToMain(msg: UiRequest): void {
  parent.postMessage({ pluginMessage: msg }, "*");
}

type Handler = (event: MainEvent) => void;

const handlers = new Set<Handler>();

export function onMainEvent(handler: Handler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function startMainListener(): () => void {
  const onMessage = (event: MessageEvent) => {
    const msg = event.data?.pluginMessage as MainEvent | undefined;
    if (!msg || typeof msg !== "object" || !("type" in msg)) return;
    for (const h of handlers) h(msg);
  };
  window.addEventListener("message", onMessage);
  return () => window.removeEventListener("message", onMessage);
}

let reqSeq = 0;

export function storageGet<T>(key: string): Promise<T | undefined> {
  const requestId = `s-${++reqSeq}`;
  return new Promise((resolve, reject) => {
    const off = onMainEvent((ev) => {
      if (ev.type !== "STORAGE_RESULT" || ev.requestId !== requestId) return;
      off();
      if (!ev.ok) reject(new Error(ev.error ?? "storage get failed"));
      else resolve(ev.value as T | undefined);
    });
    postToMain({ type: "STORAGE_GET", key, requestId });
  });
}

export function storageSet(key: string, value: unknown): Promise<void> {
  const requestId = `s-${++reqSeq}`;
  return new Promise((resolve, reject) => {
    const off = onMainEvent((ev) => {
      if (ev.type !== "STORAGE_RESULT" || ev.requestId !== requestId) return;
      off();
      if (!ev.ok) reject(new Error(ev.error ?? "storage set failed"));
      else resolve();
    });
    postToMain({ type: "STORAGE_SET", key, value, requestId });
  });
}
