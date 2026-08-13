import { useEffect, useRef } from "preact/hooks";

type Props = {
  /** What the text is, in the user's words: "Results", "Proposal markdown". */
  label: string;
  text: string;
};

/**
 * Last resort when both clipboard paths are blocked: put the text somewhere the
 * user can actually select it. Pre-selected on mount, and re-selected whenever
 * it regains focus, so ⌘C works without dragging across the whole pack.
 * Rendered inside the warning Banner that explains why.
 */
export function ManualCopyField({ label, text }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.select();
  }, [text]);

  return (
    <textarea
      ref={ref}
      class="ds-manual-copy"
      readOnly
      spellcheck={false}
      aria-label={`${label} — select the text and copy it manually`}
      value={text}
      onFocus={(e) => (e.currentTarget as HTMLTextAreaElement).select()}
    />
  );
}
