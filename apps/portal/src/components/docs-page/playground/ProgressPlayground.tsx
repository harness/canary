import { type ComponentProps, type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Progress,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Progress has two overlapping unions that the generic schema playground can't
// express, so this is a bespoke playground:
//   • variant: "default" (measurable, driven by `value`) ⊕ "indeterminate"
//   • state ⊕ color — mutually exclusive styling modes
// We surface `value` as an intuitive percent (0–100) and convert to the 0–1 the
// component wants, and we model the state/color exclusivity with a `color` select
// whose "none" option falls back to `state`.

// ① Literal unions mirrored from the component (not exported from the package).
type ProgressState =
  | "default"
  | "processing"
  | "completed"
  | "paused"
  | "failed";
type ProgressColor =
  | "gray"
  | "blue"
  | "brown"
  | "cyan"
  | "green"
  | "forest-green"
  | "indigo"
  | "lime"
  | "mint"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "violet"
  | "yellow";

const COLOR_OPTIONS: ReadonlyArray<"none" | ProgressColor> = [
  "none",
  "gray",
  "blue",
  "brown",
  "cyan",
  "green",
  "forest-green",
  "indigo",
  "lime",
  "mint",
  "orange",
  "pink",
  "purple",
  "red",
  "violet",
  "yellow",
];

// ② The state shape — one field per control.
interface State {
  variant: "default" | "indeterminate";
  percent: number;
  state: ProgressState;
  color: "none" | ProgressColor;
  size: "sm" | "md" | "lg";
  label: string;
  subtitle: string;
  description: string;
  hidePercentage: boolean;
  hideIcon: boolean;
}

const INITIAL_STATE: State = {
  variant: "default",
  percent: 75,
  state: "processing",
  color: "none",
  size: "md",
  label: "Analytics_Report_March.csv",
  subtitle: "5 min left",
  description: "",
  hidePercentage: false,
  hideIcon: false,
};

// percent (0–100) → the component's clamped 0–1 value, trimmed so the snippet
// reads 0.75 rather than 0.7500000001.
const toValue = (percent: number) =>
  Math.round(Math.min(Math.max(0, percent), 100)) / 100;

// ③ Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from defaults, and mirror the preview exactly — including
//    which props drop out in the indeterminate variant (where they're `never`).
function generateCode(s: State): string {
  const attrs: string[] = [];

  if (s.variant === "indeterminate") attrs.push(`variant="indeterminate"`);
  else attrs.push(`value={${toValue(s.percent)}}`);

  // color overrides state; "none" means keep state styling.
  if (s.color !== "none") attrs.push(`color="${s.color}"`);
  else if (s.state !== "default") attrs.push(`state="${s.state}"`);

  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.label) attrs.push(`label="${s.label}"`);
  if (s.subtitle) attrs.push(`subtitle="${s.subtitle}"`);
  if (s.description) attrs.push(`description="${s.description}"`);

  if (s.variant === "default") {
    if (s.hidePercentage) attrs.push(`hidePercentage`);
    if (s.hideIcon) attrs.push(`hideIcon`);
  }

  return `<Progress\n  ${attrs.join("\n  ")}\n/>`;
}

const ProgressPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const isIndeterminate = state.variant === "indeterminate";

  // ④ The curated control set. `value` and the determinate-only booleans drop out
  //    in the indeterminate variant, where the component rejects them.
  const controls: PropControl[] = [
    {
      name: "variant",
      type: "select",
      options: ["default", "indeterminate"],
      description: "Measurable bar, or an ongoing loading state",
    },
    ...(isIndeterminate
      ? []
      : [
          {
            name: "percent",
            type: "number" as const,
            description: "Percent complete (0–100)",
          },
        ]),
    {
      name: "state",
      type: "select",
      options: ["default", "processing", "completed", "paused", "failed"],
      description: "Semantic state (ignored when a color is set)",
    },
    {
      name: "color",
      type: "select",
      options: [...COLOR_OPTIONS],
      description: "Palette color; overrides state. 'none' keeps state styling",
    },
    {
      name: "size",
      type: "select",
      options: ["sm", "md", "lg"],
    },
    { name: "label", type: "text", description: "Empty hides the prop" },
    { name: "subtitle", type: "text", description: "Empty hides the prop" },
    { name: "description", type: "text", description: "Empty hides the prop" },
    ...(isIndeterminate
      ? []
      : [
          {
            name: "hidePercentage" as const,
            type: "boolean" as const,
            description: "Hide the percentage next to the label",
          },
          {
            name: "hideIcon" as const,
            type: "boolean" as const,
            description: "Hide the status icon",
          },
        ]),
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the text/select controls.
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

  // ⑤ Render the real component from state. The union is awkward to satisfy with
  //    a built object, so we assemble the props and cast at the boundary — the
  //    conditions below match generateCode exactly so preview and snippet agree.
  const useColor = state.color !== "none";
  const progressProps = {
    size: state.size,
    label: state.label || undefined,
    subtitle: state.subtitle || undefined,
    description: state.description || undefined,
    ...(useColor
      ? { color: state.color as ProgressColor }
      : { state: state.state }),
    ...(isIndeterminate
      ? { variant: "indeterminate" as const }
      : {
          value: toValue(state.percent),
          hidePercentage: state.hidePercentage,
          hideIcon: state.hideIcon,
        }),
  };

  const preview = (
    <div className="w-full max-w-[600px]">
      <Progress {...(progressProps as ComponentProps<typeof Progress>)} />
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: shows the live bar; reset anchors to this box --- */}
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

        {/* --- Control grids: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
        </div>
        {booleanControls.length > 0 && (
          <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
            {booleanControls.map(renderControl)}
          </div>
        )}

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

export default ProgressPlayground;
