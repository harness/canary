import type { JSX } from "preact";
import { useRef } from "preact/hooks";

export type TabItem<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label?: string;
};

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label = "Sections",
}: Props<T>) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Automatic activation (WAI-ARIA tabs pattern): arrow keys move focus and
  // select in one step, so the focus ring and aria-selected never disagree.
  const activate = (index: number) => {
    const next = items[index];
    if (!next) return;
    onChange(next.id);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown: JSX.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const idx = items.findIndex((i) => i.id === value);
    if (idx < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      activate((idx + delta + items.length) % items.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      activate(0);
    } else if (e.key === "End") {
      e.preventDefault();
      activate(items.length - 1);
    }
  };

  return (
    <div
      class="ds-tabs"
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          type="button"
          role="tab"
          id={`tab-${item.id}`}
          aria-selected={value === item.id}
          aria-controls={`panel-${item.id}`}
          tabindex={value === item.id ? 0 : -1}
          class="ds-tab"
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
