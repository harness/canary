import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Shimmer,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Shimmer is a single, self-contained component — a string of text with an
// infinitely-looping light sweep. It only reads as real in motion, and its
// knobs (duration, spread, color, variant, element) are easiest to feel when
// you tweak them against a live, animating sample. So this is a bespoke
// playground: the preview is a running Shimmer and the controls shape it.

// Curated subsets of the component's larger token unions — enough to show the
// range without dumping every typography variant into a dropdown.
const AS_OPTIONS = ["p", "span", "div", "h2", "h3"];
const VARIANT_OPTIONS = [
  "body-normal",
  "body-strong",
  "body-code",
  "caption-normal",
  "heading-base",
  "heading-section",
];
const COLOR_OPTIONS = [
  "foreground-1",
  "foreground-2",
  "foreground-3",
  "foreground-4",
  "disabled",
  "success",
  "warning",
  "danger",
  "brand",
  "merged",
];

// ① The state shape — one field per control.
interface State {
  children: string;
  as: string;
  variant: string;
  color: string;
  duration: number;
  spread: number;
}

const INITIAL_STATE: State = {
  children: "Generating response…",
  as: "p",
  variant: "body-normal",
  color: "foreground-2",
  duration: 2,
  spread: 2,
};

// ② Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from defaults, and mirror the preview exactly. When no
//    props differ, collapse to the one-line form.
function generateCode(s: State): string {
  const props: string[] = [];
  if (s.as !== "p") props.push(`  as="${s.as}"`);
  if (s.variant !== "body-normal") props.push(`  variant="${s.variant}"`);
  if (s.color !== "foreground-2") props.push(`  color="${s.color}"`);
  if (s.duration !== 2) props.push(`  duration={${s.duration}}`);
  if (s.spread !== 2) props.push(`  spread={${s.spread}}`);

  if (props.length === 0) {
    return `<Shimmer>${s.children}</Shimmer>`;
  }

  return ["<Shimmer", ...props, `>`, `  ${s.children}`, "</Shimmer>"].join("\n");
}

const ShimmerPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, val: State[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const reset = () => setState(INITIAL_STATE);

  // ③ The curated control set.
  const controls: PropControl[] = [
    {
      name: "children",
      type: "text",
      required: true,
      description: "The text to shimmer",
    },
    {
      name: "as",
      type: "select",
      options: AS_OPTIONS,
      description: "Element type to render",
    },
    {
      name: "variant",
      type: "select",
      options: VARIANT_OPTIONS,
      description: "Typography variant",
    },
    {
      name: "color",
      type: "select",
      options: COLOR_OPTIONS,
      description: "Text color token",
    },
    {
      name: "duration",
      type: "number",
      description: "Animation duration (seconds)",
    },
    {
      name: "spread",
      type: "number",
      description: "Highlight width multiplier",
    },
  ];

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ④ Render the real component from state. Keep every value aligned with
  //    generateCode so preview and snippet agree. The `key` forces a remount
  //    when the element type changes so framer-motion rebinds cleanly.
  const preview = (
    <Shimmer
      key={state.as}
      as={state.as}
      variant={state.variant as never}
      color={state.color as never}
      duration={state.duration}
      spread={state.spread}
    >
      {state.children || " "}
    </Shimmer>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live shimmer; reset anchors to this box --- */}
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

        {/* --- Control grid: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {controls.map(renderControl)}
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

export default ShimmerPlayground;
