import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Slider,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Slider is a single component, but it only reads as real when you drag it, and
// its shape shifts with its props: one thumb or two, a description caption or
// min/max end labels, a live value with custom formatting. So this is a bespoke
// playground — the preview is a working Slider driven by real interaction, the
// controls shape it, and a readout echoes the current value.

// ① The state shape — one field per control. `range` is a playground-only knob
//    (the real prop is the length of value/defaultValue); the rest map 1:1.
interface State {
  label: string;
  range: boolean;
  caption: "description" | "min-max";
  description: string;
  minLabel: string;
  maxLabel: string;
  unit: string;
  showValue: boolean;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  label: "Pipeline timeout",
  range: false,
  caption: "description",
  description: "Maximum execution time in minutes",
  minLabel: "0",
  maxLabel: "100",
  unit: "m",
  showValue: true,
  min: 5,
  max: 120,
  step: 5,
  disabled: false,
};

const INITIAL_VALUE = [30];

// Even spread of thumbs across the current domain when switching single/range.
const thumbsFor = (range: boolean, min: number, max: number): number[] => {
  const at = (p: number) => Math.round(min + (max - min) * p);
  return range ? [at(0.25), at(0.75)] : [at(0.25)];
};

// ② Turn the current state + live value into the JSX string shown in "Show
//    code". Emit the value as an uncontrolled `defaultValue` (the common
//    pattern) and only add props that differ from their defaults.
function generateCode(s: State, value: number[]): string {
  const lines = ["<Slider"];
  if (s.label) lines.push(`  label="${s.label}"`);
  lines.push(`  defaultValue={[${value.join(", ")}]}`);
  if (s.min !== 0) lines.push(`  min={${s.min}}`);
  if (s.max !== 100) lines.push(`  max={${s.max}}`);
  if (s.step !== 1) lines.push(`  step={${s.step}}`);
  if (s.caption === "min-max") {
    lines.push('  caption="min-max"');
    if (s.minLabel !== "0") lines.push(`  minLabel="${s.minLabel}"`);
    if (s.maxLabel !== "100") lines.push(`  maxLabel="${s.maxLabel}"`);
  } else if (s.description) {
    lines.push(`  description="${s.description}"`);
  }
  if (s.showValue) lines.push("  showValue");
  if (s.unit)
    lines.push(
      "  formatValue={(v) => v.map((n) => `${n}" + s.unit + "`).join(' – ')}",
    );
  if (s.disabled) lines.push("  disabled");
  lines.push("/>");
  return lines.join("\n");
}

const SliderPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // The value is driven by dragging, not a control — so it lives on its own and
  // the readout reflects it live.
  const [value, setValue] = useState<number[]>(INITIAL_VALUE);

  const set = <K extends keyof State>(key: K, val: State[K]) => {
    setState((prev) => ({ ...prev, [key]: val }));

    // A few controls have to reshape the live value to stay valid.
    if (key === "range") {
      setValue(thumbsFor(val as boolean, state.min, state.max));
    } else if (key === "min" || key === "max") {
      const min = key === "min" ? (val as number) : state.min;
      const max = key === "max" ? (val as number) : state.max;
      setValue((prev) => prev.map((n) => Math.min(max, Math.max(min, n))));
    }
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setValue(INITIAL_VALUE);
  };

  // ③ The curated control set.
  const controls: PropControl[] = [
    { name: "label", type: "text", description: "Label above the track" },
    {
      name: "caption",
      type: "select",
      options: ["description", "min-max"],
      description: "What shows below the track",
    },
    {
      name: "description",
      type: "text",
      description: "Helper text (caption='description')",
    },
    {
      name: "minLabel",
      type: "text",
      description: "Left end label (caption='min-max')",
    },
    {
      name: "maxLabel",
      type: "text",
      description: "Right end label (caption='min-max')",
    },
    {
      name: "unit",
      type: "text",
      description: "Unit suffix for the shown value",
    },
    { name: "min", type: "number", description: "Minimum value" },
    { name: "max", type: "number", description: "Maximum value" },
    { name: "step", type: "number", description: "Step increment" },
    {
      name: "range",
      type: "boolean",
      description: "Use two thumbs (a range)",
    },
    {
      name: "showValue",
      type: "boolean",
      description: "Show the current value by the track",
    },
    { name: "disabled", type: "boolean", description: "Disable the slider" },
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the text/select/number controls.
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

  // A custom formatter only when a unit is set; otherwise the component's
  // default (raw number, or "min – max" for a range).
  const formatValue = state.unit
    ? (vals: number[]) => vals.map((n) => `${n}${state.unit}`).join(" – ")
    : undefined;

  // ④ Render the real component from state. Keep every value aligned with
  //    generateCode so preview and snippet agree.
  const preview = (
    <div className="flex w-full max-w-[460px] flex-col gap-cn-md">
      <Slider
        label={state.label || undefined}
        caption={state.caption}
        description={state.description || undefined}
        minLabel={state.minLabel}
        maxLabel={state.maxLabel}
        showValue={state.showValue}
        formatValue={formatValue}
        value={value}
        onValueChange={setValue}
        min={state.min}
        max={state.max}
        step={state.step}
        disabled={state.disabled}
      />
      <div className="rounded-cn-3 border p-cn-sm">
        <div className="text-cn-size-2 text-cn-2 font-medium">Value</div>
        <p className="mt-cn-3xs font-body-code text-cn-size-2">
          [{value.join(", ")}]
        </p>
      </div>
    </div>
  );

  const code = useMemo(() => generateCode(state, value), [state, value]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live slider; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[200px] items-center justify-center p-cn-3xl">
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

export default SliderPlayground;
