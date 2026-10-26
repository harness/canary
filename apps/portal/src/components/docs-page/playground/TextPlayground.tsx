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

// Text is a prop-driven typographic primitive: `variant` picks the type style,
// `color`/`align` the treatment, and `wrap`/`truncate`/`lineClamp` the overflow
// behavior. It's a bespoke playground mainly so the preview lives inside a FIXED
// width box — `wrap`, `truncate`, and `lineClamp` only have a visible effect when
// the text has a constrained width to overflow, so the sample copy is long and the
// stage is capped at ~420px.

// ① Sample copy shared by the preview and the generated snippet. Long enough to
//    overflow the capped width so the wrapping/clamping controls visibly bite.
const SAMPLE_TEXT =
  "Consistency in typography helps users navigate content with ease. Always use hierarchy to guide attention and improve readability.";

// The non-deprecated typographic variants (caption-light is deprecated, so it's
// left out of the interactive picker).
const VARIANT_OPTIONS = [
  "heading-hero",
  "heading-section",
  "heading-default",
  "heading-subsection",
  "heading-base",
  "heading-small",
  "body-normal",
  "body-single-line-normal",
  "body-strong",
  "body-single-line-strong",
  "body-code",
  "caption-normal",
  "caption-strong",
  "caption-code",
  "caption-single-line-normal",
];
// `default` = omit the prop so the variant's own default color applies (headings
// default to foreground-1, everything else to foreground-2).
const COLOR_OPTIONS = [
  "default",
  "inherit",
  "foreground-1",
  "foreground-2",
  "foreground-3",
  "foreground-4",
  "disabled",
  "success",
  "warning",
  "merged",
  "danger",
  "brand",
];
const ALIGN_OPTIONS = ["default", "left", "center", "right"];
const WRAP_OPTIONS = ["default", "wrap", "nowrap", "pretty", "balance"];
const LINE_CLAMP_OPTIONS = ["none", "1", "2", "3", "4", "5", "6"];

// ② The state shape — one field per control.
interface State {
  content: string;
  variant: string;
  color: string;
  align: string;
  wrap: string;
  lineClamp: string;
  truncate: boolean;
}

const INITIAL_STATE: State = {
  content: SAMPLE_TEXT,
  variant: "body-normal",
  color: "default",
  align: "default",
  wrap: "default",
  lineClamp: "none",
  truncate: false,
};

// ③ Mirror the preview exactly. `variant` is always emitted (it's the headline
//    knob); the "default"/"none" sentinels mean "omit the prop" so the snippet
//    only shows props that actually change something.
function generateCode(s: State): string {
  const attrs: string[] = [`variant="${s.variant}"`];
  if (s.color !== "default") attrs.push(`color="${s.color}"`);
  if (s.align !== "default") attrs.push(`align="${s.align}"`);
  if (s.wrap !== "default") attrs.push(`wrap="${s.wrap}"`);
  if (s.lineClamp !== "none") attrs.push(`lineClamp="${s.lineClamp}"`);
  if (s.truncate) attrs.push("truncate");

  const open =
    attrs.length === 1
      ? `<Text ${attrs[0]}>`
      : `<Text\n  ${attrs.join("\n  ")}\n>`;
  return `${open}\n  ${s.content}\n</Text>`;
}

const TextPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "content",
      type: "text",
      required: true,
      description: "The text to render",
    },
    {
      name: "variant",
      type: "select",
      options: VARIANT_OPTIONS,
      description: "Typographic style",
    },
    {
      name: "color",
      type: "select",
      options: COLOR_OPTIONS,
      description: "default = variant's own color",
    },
    {
      name: "align",
      type: "select",
      options: ALIGN_OPTIONS,
      description: "Text alignment",
    },
    {
      name: "wrap",
      type: "select",
      options: WRAP_OPTIONS,
      description: "Wrapping behavior",
    },
    {
      name: "lineClamp",
      type: "select",
      options: LINE_CLAMP_OPTIONS,
      description: "Lines before clamping (overrides truncate)",
    },
    {
      name: "truncate",
      type: "boolean",
      description: "Single-line ellipsis (lineClamp wins if set)",
    },
  ];

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

  // ⑤ Render the real Text from state inside a width-capped box so the wrapping and
  //    clamping controls have something to overflow. The "default"/"none" sentinels
  //    map back to undefined so the component falls back to its own defaults.
  const preview = (
    <div className="w-full max-w-[420px]">
      <Text
        variant={state.variant as never}
        color={state.color === "default" ? undefined : (state.color as never)}
        align={state.align === "default" ? undefined : (state.align as never)}
        wrap={state.wrap === "default" ? undefined : (state.wrap as never)}
        lineClamp={
          state.lineClamp === "none" ? undefined : (state.lineClamp as never)
        }
        truncate={state.truncate}
      >
        {state.content}
      </Text>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex min-h-[180px] items-center justify-center p-cn-3xl">
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

export default TextPlayground;
