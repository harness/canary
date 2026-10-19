import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  ScrollArea,
  Tag,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// ScrollArea is a single component (not compound), but its headline feature —
// the IntersectionObserver edge callbacks — only comes alive when you actually
// scroll. So this is a bespoke playground: the preview wires onScrollTop /
// onScrollBottom to a live position Tag, and the controls shape the viewport
// (direction, height, horizontal overflow) and toggle the edge tracking.

// ① Filler rows shared by BOTH the preview and the generated snippet so the two
//    never drift. Enough rows to force vertical overflow at any sane height.
const ROWS = Array.from(
  { length: 14 },
  (_, i) => `Row ${i + 1} — scrollable content that overflows the viewport.`,
);

// ② The state shape — one field per control.
interface State {
  direction: "ltr" | "rtl";
  height: number;
  wideContent: boolean;
  trackEdges: boolean;
}

const INITIAL_STATE: State = {
  direction: "ltr",
  height: 200,
  wideContent: false,
  trackEdges: true,
};

// ③ Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from defaults, and mirror the preview exactly.
function generateCode(s: State): string {
  const attrs: string[] = [
    `className="h-[${s.height}px] w-[320px] rounded border"`,
  ];
  if (s.direction === "rtl") attrs.push(`direction="rtl"`);
  if (s.trackEdges) {
    attrs.push("onScrollTop={(entry) => setAtTop(entry.isIntersecting)}");
    attrs.push("onScrollBottom={(entry) => setAtBottom(entry.isIntersecting)}");
  }

  const contentClass = s.wideContent
    ? "space-y-cn-md p-cn-md w-[700px]"
    : "space-y-cn-md p-cn-md";

  const rows = ROWS.map((r) => `    <p>${r}</p>`).join("\n");

  return [
    `<ScrollArea\n  ${attrs.join("\n  ")}\n>`,
    `  <div className="${contentClass}">`,
    rows,
    "  </div>",
    "</ScrollArea>",
  ].join("\n");
}

const ScrollAreaPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // Edge position is driven by the real callbacks, not a control — scroll to see
  // it change. Content always overflows vertically, so it starts at the top.
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setAtTop(true);
    setAtBottom(false);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "direction",
      type: "select",
      options: ["ltr", "rtl"],
      description: "Text/scroll direction",
    },
    {
      name: "height",
      type: "number",
      description: "Viewport height in pixels",
    },
    {
      name: "wideContent",
      type: "boolean",
      description: "Make the content overflow horizontally too",
    },
    {
      name: "trackEdges",
      type: "boolean",
      description:
        "Wire onScrollTop/onScrollBottom and show a live position tag",
    },
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the select/number controls.
  const inputControls = controls.filter((c) => c.type !== "boolean");
  const booleanControls = controls.filter((c) => c.type === "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // Prefer atTop: on mount both edge sentinels' initial IntersectionObserver
  // callbacks fire `true`, and (when content fits) both stay true — in either
  // case "At top" is the honest label. Real scroll states resolve cleanly:
  // scrolled-to-bottom is atTop=false/atBottom=true, mid-scroll is both false.
  const position = atTop
    ? { label: "At top", theme: "blue" as const }
    : atBottom
      ? { label: "At bottom", theme: "green" as const }
      : { label: "Scrolling", theme: "gray" as const };

  // ⑤ Render the real component from state. Height/width go through inline style
  //    (the dev server's JIT can't generate an arbitrary h-[Npx] class at
  //    runtime); the snippet shows the idiomatic className form. Keep every
  //    condition aligned with generateCode so preview and snippet agree.
  const preview = (
    <div className="flex flex-col items-center gap-cn-sm">
      {state.trackEdges && (
        <Tag value={position.label} theme={position.theme} />
      )}
      <ScrollArea
        className="rounded-cn-4 border"
        style={{ width: 320, height: state.height }}
        direction={state.direction}
        onScrollTop={
          state.trackEdges
            ? (entry) => setAtTop(entry.isIntersecting)
            : undefined
        }
        onScrollBottom={
          state.trackEdges
            ? (entry) => setAtBottom(entry.isIntersecting)
            : undefined
        }
      >
        <div
          dir={state.direction}
          className={
            state.wideContent
              ? "space-y-cn-md p-cn-md w-[700px]"
              : "space-y-cn-md p-cn-md"
          }
        >
          {ROWS.map((r) => (
            <p key={r}>{r}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live scroll area; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[280px] items-center justify-center p-cn-3xl">
          <Button
            variant="outline"
            size="sm"
            iconOnly
            onClick={reset}
            className="absolute right-cn-sm top-cn-sm z-10"
            tooltipProps={{ content: "Reset to defaults" }}
          >
            <IconV2 name="refresh" />
          </Button>

          {preview}
        </div>

        {/* --- Control grids: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
        </div>
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {booleanControls.map(renderControl)}
        </div>

        {/* --- Show code --- */}
        <details className="example-expand bg-cn-2 relative border-t p-cn-sm">
          <CopyButton
            buttonVariant="transparent"
            className="absolute right-cn-sm top-cn-sm"
            name={code}
          />
          <summary className="flex cursor-pointer select-none items-center gap-cn-3xs text-cn-size-2">
            Show code
          </summary>
          <pre
            className="font-body-code p-cn-3xs text-cn-size-2 leading-6"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {code}
          </pre>
        </details>
      </div>
    </TooltipProvider>
  );
};

export default ScrollAreaPlayground;
