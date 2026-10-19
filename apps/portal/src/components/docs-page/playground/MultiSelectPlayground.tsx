import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  MultiSelect,
  type MultiSelectOption,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// MultiSelect is a single component, but its behaviour only reads as real when
// you interact: pick options to see removable tags, type + Enter to create new
// ones, and toggle creation/validation. So this is a bespoke playground: the
// preview is a working MultiSelect, the controls shape it, and a readout lists
// the currently selected keys.

// ① A fixed option list shared by BOTH the preview and the generated snippet so
//    the two never drift.
const OPTIONS: MultiSelectOption[] = [
  { key: "nextjs", id: "nextjs" },
  { key: "Vite", id: "vite" },
  { key: "Nuxt", id: "nuxt" },
  { key: "Vue", id: "vue" },
];

const INITIAL_VALUE: MultiSelectOption[] = [{ key: "React", id: "react" }];

// ② The state shape — one field per control.
interface State {
  label: string;
  placeholder: string;
  caption: string;
  error: string;
  warning: string;
  tooltipContent: string;
  theme: "default" | "danger" | "warning";
  orientation: "vertical" | "horizontal";
  disallowCreation: boolean;
  disabled: boolean;
  optional: boolean;
}

const INITIAL_STATE: State = {
  label: "Frameworks",
  placeholder: "Select frameworks you like…",
  caption: "Choose the frameworks you work with.",
  error: "",
  warning: "",
  tooltipContent: "Pick the frameworks your team works with.",
  theme: "default",
  orientation: "vertical",
  disallowCreation: false,
  disabled: false,
  optional: false,
};

// ③ Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from defaults, and mirror the preview exactly.
function generateCode(s: State): string {
  const lines = ["<MultiSelect"];
  if (s.label) lines.push(`  label="${s.label}"`);
  if (s.tooltipContent)
    lines.push(`  tooltipContent="${s.tooltipContent}"`);
  lines.push("  options={[");
  lines.push('    { key: "nextjs", id: "nextjs" },');
  lines.push('    { key: "Vite", id: "vite" },');
  lines.push('    { key: "Nuxt", id: "nuxt" },');
  lines.push('    { key: "Vue", id: "vue" },');
  lines.push("  ]}");
  lines.push("  value={value}");
  lines.push("  onChange={setValue}");
  lines.push(`  placeholder="${s.placeholder}"`);
  if (s.caption) lines.push(`  caption="${s.caption}"`);
  if (s.error) lines.push(`  error="${s.error}"`);
  if (s.warning) lines.push(`  warning="${s.warning}"`);
  if (s.theme !== "default") lines.push(`  theme="${s.theme}"`);
  if (s.orientation !== "vertical")
    lines.push(`  orientation="${s.orientation}"`);
  if (s.disallowCreation) lines.push("  disallowCreation");
  if (s.disabled) lines.push("  disabled");
  if (s.optional) lines.push("  optional");
  lines.push("/>");
  return lines.join("\n");
}

const MultiSelectPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // The selection is driven by real interaction, not a control — pick, remove,
  // or (when allowed) create options to watch it change.
  const [value, setValue] = useState<MultiSelectOption[]>(INITIAL_VALUE);

  const set = <K extends keyof State>(key: K, val: State[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const reset = () => {
    setState(INITIAL_STATE);
    setValue(INITIAL_VALUE);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    { name: "label", type: "text", description: "Label above the field" },
    { name: "placeholder", type: "text", description: "Empty-state text" },
    {
      name: "caption",
      type: "text",
      description: "Helper text below the field",
    },
    {
      name: "error",
      type: "text",
      description: "Error message (forces the danger theme)",
    },
    {
      name: "warning",
      type: "text",
      description: "Warning message (forces the warning theme)",
    },
    {
      name: "tooltipContent",
      type: "text",
      description: "Info tooltip shown next to the label",
    },
    {
      name: "theme",
      type: "select",
      options: ["default", "danger", "warning"],
      description: "Validation styling",
    },
    {
      name: "orientation",
      type: "select",
      options: ["vertical", "horizontal"],
      description: "Label position",
    },
    {
      name: "disallowCreation",
      type: "boolean",
      description: "Prevent creating options from typed text",
    },
    { name: "disabled", type: "boolean", description: "Disable the field" },
    {
      name: "optional",
      type: "boolean",
      description: "Show an 'optional' indicator on the label",
    },
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

  // ⑤ Render the real component from state. Keep every condition aligned with
  //    generateCode so preview and snippet agree.
  const preview = (
    <div className="flex w-full max-w-[440px] flex-col gap-cn-md">
      <MultiSelect
        label={state.label || undefined}
        tooltipContent={state.tooltipContent || undefined}
        options={OPTIONS}
        value={value}
        onChange={setValue}
        placeholder={state.placeholder}
        caption={state.caption || undefined}
        error={state.error || undefined}
        warning={state.warning || undefined}
        theme={state.theme}
        orientation={state.orientation}
        disallowCreation={state.disallowCreation}
        disabled={state.disabled}
        optional={state.optional}
      />
      <div className="rounded-cn-3 border p-cn-sm">
        <div className="text-cn-size-2 text-cn-2 font-medium">
          Selected ({value.length})
        </div>
        <p className="mt-cn-3xs font-body-code text-cn-size-2">
          {value.length ? value.map((o) => o.key).join(", ") : "(none)"}
        </p>
      </div>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live multi-select; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[220px] items-center justify-center p-cn-3xl">
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

export default MultiSelectPlayground;
