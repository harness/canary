import { useEffect, useMemo, useRef, useState } from "react";

import { useFlowCard } from "@harnessio/ui/components";

interface UseDemoLogStreamOptions {
  /** Milliseconds between log lines while the card is active. */
  intervalMs?: number;
}

/**
 * Streams demo log lines while a card is active. Once the card leaves the active
 * state, the full sequence is shown synchronously from props — not from streaming
 * state — so logs survive substep collapse and card remounts in SinglePaneStepper.
 */
export function useDemoLogStream(
  getSequence: () => string[],
  onComplete: () => void,
  deps: unknown[],
  options?: UseDemoLogStreamOptions,
) {
  const { status } = useFlowCard();
  const intervalMs = options?.intervalMs ?? 400;
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-owned deps for dynamic sequences
  const sequence = useMemo(getSequence, deps);

  const isInactive = status !== "active";
  const displayLogs = isInactive ? sequence : logs;
  const displayDone = isInactive || done;

  useEffect(() => {
    if (status !== "active") return;

    setLogs([]);
    setDone(false);
    let cancelled = false;
    let index = 0;

    const tick = () => {
      if (cancelled || index >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          onCompleteRef.current();
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[index++]]);
      setTimeout(tick, intervalMs);
    };

    tick();

    return () => {
      cancelled = true;
    };
  }, [status, sequence, intervalMs]);

  return { logs: displayLogs, done: displayDone };
}
