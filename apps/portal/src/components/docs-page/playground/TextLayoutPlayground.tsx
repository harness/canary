import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Text,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Focused Text playgrounds for the Typography page's layout sections. One frame,
// three `mode`s, each exposing only the props relevant to that section:
//   align    → `align`
//   wrap     → `wrap` (+ a width control so wrapping has something to bite on)
//   truncate → `truncate` / `lineClamp` (+ width)
// For the full prop surface see TextPlayground.

type Mode = "align" | "wrap" | "truncate";

// Sample copy shared by the preview and the generated snippet. Long enough to
// wrap/overflow/clamp inside the narrower width options.
const SAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!";

const ALIGN_OPTIONS = ["left", "center", "right"];
const WRAP_OPTIONS = ["wrap", "nowrap", "balance", "pretty"];
const LINE_CLAMP_OPTIONS = ["none", "1", "2", "3", "4", "5", "6"];
const WIDTH_OPTIONS = ["160", "240", "320", "420"];

interface State {
  content: string;
  align: string;
  wrap: string;
  width: string;
  lineClamp: string;
  truncate: boolean;
}

const INITIAL_STATE: Record<Mode, State> = {
  align: {
    content: "Aligned text sits inside a fixed-width box.",
    align: "left",
    wrap: "wrap",
    width: "420",
    lineClamp: "none",
    truncate: false,
  },
  wrap: {
    content: SAMPLE_TEXT,
    align: "left",
    wrap: "wrap",
    width: "240",
    lineClamp: "none",
    truncate: false,
  },
  truncate: {
    content: SAMPLE_TEXT,
    align: "left",
    wrap: "wrap",
    width: "320",
    lineClamp: "none",
    truncate: true,
  },
};

const CONTROLS: Record<Mode, PropControl[]> = {
  align: [
    {
      name: "content",
      type: "text",
      required: true,
      description: "The text to render",
    },
    {
      name: "align",
      type: "select",
      options: ALIGN_OPTIONS,
      description: "Horizontal alignment",
    },
  ],
  wrap: [
    {
      name: "content",
      type: "text",
      required: true,
      description: "The text to render",
    },
    {
      name: "wrap",
      type: "select",
      options: WRAP_OPTIONS,
      description: "Wrapping behavior",
    },
    {
      name: "width",
      type: "select",
      options: WIDTH_OPTIONS,
      description: "Container width (px)",
    },
  ],
  truncate: [
    {
      name: "content",
      type: "text",
      required: true,
      description: "The text to render",
    },
    {
      name: "lineClamp",
      type: "select",
      options: LINE_CLAMP_OPTIONS,
      description: "Lines before clamping (overrides truncate)",
    },
    {
      name: "width",
      type: "select",
      options: WIDTH_OPTIONS,
      description: "Container width (px)",
    },
    {
      name: "truncate",
      type: "boolean",
      description: "Single-line ellipsis (lineClamp wins if set)",
    },
  ],
};

// Mirror the preview exactly: only emit props that are set for this mode, and
// include the width wrapper since wrap/truncate only matter inside a constrained box.
function generateCode(mode: Mode, s: State): string {
  const attrs: string[] = [];
  if (mode === "align") attrs.push(`align="${s.align}"`);
  if (mode === "wrap") attrs.push(`wrap="${s.wrap}"`);
  if (mode === "truncate") {
    if (s.lineClamp !== "none") attrs.push(`lineClamp={${s.lineClamp}}`);
    else if (s.truncate) attrs.push("truncate");
  }

  const open = attrs.length ? `<Text ${attrs.join(" ")}>` : "<Text>";
  const text = `${open}${s.content}</Text>`;
  return mode === "align"
    ? `<div className="w-[${s.width}px]">\n  ${text}\n</div>`
    : `<div className="w-[${s.width}px]">\n  ${text}\n</div>`;
}

const TextLayoutPlayground: FC<{ mode: Mode }> = ({ mode }) => {
  const [state, setState] = useState<State>(INITIAL_STATE[mode]);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE[mode]);

  const controls = CONTROLS[mode];
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

  const clamp = mode === "truncate" && state.lineClamp !== "none";
  const preview = (
    <div
      className="max-w-full overflow-hidden rounded-cn-3 border border-dashed border-cn-2 bg-cn-1 p-cn-sm"
      style={{ width: `${state.width}px` }}
    >
      <Text
        align={mode === "align" ? (state.align as never) : undefined}
        wrap={mode === "wrap" ? (state.wrap as never) : undefined}
        lineClamp={clamp ? (Number(state.lineClamp) as never) : undefined}
        truncate={mode === "truncate" && !clamp ? state.truncate : undefined}
      >
        {state.content}
      </Text>
    </div>
  );

  const code = useMemo(() => generateCode(mode, state), [mode, state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        <div className="bg-cn-2 relative flex min-h-[160px] items-center justify-center p-cn-3xl">
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

        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
        </div>
        {booleanControls.length > 0 && (
          <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
            {booleanControls.map(renderControl)}
          </div>
        )}

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

export default TextLayoutPlayground;
