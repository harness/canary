import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Select,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Select is a single component, but it's driven by an `options` list and a
// controlled value/onChange pair, and several of its knobs (clearable, search,
// sizes, validation theme) only read as real when you can toggle them against a
// live dropdown. So this is a bespoke playground: the preview is a working
// Select, the controls shape it, and a readout shows the current value.

// ① A fixed option list shared by BOTH the preview and the generated snippet so
//    the two never drift.
const OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Strawberry", value: "strawberry" },
];

// ② The state shape — one field per control.
interface State {
  label: string;
  placeholder: string;
  caption: string;
  error: string;
  warning: string;
  tooltipContent: string;
  size: "md" | "sm";
  theme: "default" | "danger" | "warning";
  orientation: "vertical" | "horizontal";
  contentWidth: "auto" | "triggerWidth";
  clearable: boolean;
  allowSearch: boolean;
  isLoading: boolean;
  disabled: boolean;
  optional: boolean;
}

const INITIAL_STATE: State = {
  label: "Fruit",
  placeholder: "Select a fruit",
  caption: "Choose your favorite fruit.",
  error: "",
  warning: "",
  tooltipContent: "Pick one fruit from the list.",
  size: "md",
  theme: "default",
  orientation: "vertical",
  contentWidth: "triggerWidth",
  clearable: true,
  allowSearch: false,
  isLoading: false,
  disabled: false,
  optional: false,
};

// ③ Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from defaults, and mirror the preview exactly.
function generateCode(s: State): string {
  const lines = ["<Select"];
  if (s.label) lines.push(`  label="${s.label}"`);
  if (s.tooltipContent) lines.push(`  tooltipContent="${s.tooltipContent}"`);
  lines.push("  options={[");
  lines.push('    { label: "Apple", value: "apple" },');
  lines.push('    { label: "Banana", value: "banana" },');
  lines.push('    { label: "Orange", value: "orange" },');
  lines.push('    { label: "Strawberry", value: "strawberry" },');
  lines.push("  ]}");
  lines.push("  value={value}");
  lines.push("  onChange={setValue}");
  lines.push(`  placeholder="${s.placeholder}"`);
  if (s.caption) lines.push(`  caption="${s.caption}"`);
  if (s.error) lines.push(`  error="${s.error}"`);
  if (s.warning) lines.push(`  warning="${s.warning}"`);
  if (s.size !== "md") lines.push(`  size="${s.size}"`);
  if (s.theme !== "default") lines.push(`  theme="${s.theme}"`);
  if (s.orientation !== "vertical")
    lines.push(`  orientation="${s.orientation}"`);
  if (s.contentWidth !== "auto")
    lines.push(`  contentWidth="${s.contentWidth}"`);
  if (s.clearable) lines.push("  clearable");
  if (s.allowSearch) lines.push("  allowSearch");
  if (s.isLoading) lines.push("  isLoading");
  if (s.disabled) lines.push("  disabled");
  if (s.optional) lines.push("  optional");
  lines.push("/>");
  return lines.join("\n");
}

const SelectPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // The selection is driven by real interaction, not a control — pick an option
  // to watch it change (and the clear button reset it to undefined).
  const [value, setValue] = useState<string | undefined>(undefined);

  const set = <K extends keyof State>(key: K, val: State[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const reset = () => {
    setState(INITIAL_STATE);
    setValue(undefined);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    { name: "label", type: "text", description: "Label above the trigger" },
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
      name: "size",
      type: "select",
      options: ["md", "sm"],
      description: "Trigger size",
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
      name: "contentWidth",
      type: "select",
      options: ["auto", "triggerWidth"],
      description: "Dropdown width",
    },
    {
      name: "clearable",
      type: "boolean",
      description: "Show a clear button once a value is set",
    },
    {
      name: "allowSearch",
      type: "boolean",
      description: "Add an in-dropdown search box",
    },
    {
      name: "isLoading",
      type: "boolean",
      description: "Show a loading indicator in the dropdown",
    },
    { name: "disabled", type: "boolean", description: "Disable the select" },
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
    <div className="flex w-full max-w-[420px] flex-col gap-cn-md">
      <Select
        label={state.label || undefined}
        tooltipContent={state.tooltipContent || undefined}
        options={OPTIONS}
        value={value}
        onChange={setValue}
        placeholder={state.placeholder}
        caption={state.caption || undefined}
        error={state.error || undefined}
        warning={state.warning || undefined}
        size={state.size}
        theme={state.theme}
        orientation={state.orientation}
        contentWidth={state.contentWidth}
        clearable={state.clearable}
        allowSearch={state.allowSearch}
        isLoading={state.isLoading}
        disabled={state.disabled}
        optional={state.optional}
      />
      <div className="rounded-cn-3 border p-cn-sm">
        <div className="text-cn-size-2 text-cn-2 font-medium">
          Selected value
        </div>
        <p className="mt-cn-3xs font-body-code text-cn-size-2">
          {value ?? "(none)"}
        </p>
      </div>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live select; reset anchors to this box --- */}
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

export default SelectPlayground;
