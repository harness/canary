import { type FC, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Checkbox is a single, prop-driven component, but its `checked` prop is tri-state
// (boolean | 'indeterminate') and it's meant to be controlled, so this is a small
// bespoke playground: the controls drive the props, the preview owns the live checked
// state so clicking the box toggles it, and the snippet mirrors the controlled usage.

// ① Sample copy shared by BOTH the preview and the generated snippet.
const SAMPLE_LABEL = "Accept terms and conditions";
const SAMPLE_CAPTION = "You must accept terms and conditions to proceed.";

// ② State — one field per control. `checked` is a string so it can carry the
//    tri-state ('unchecked' | 'checked' | 'indeterminate') through the Select.
interface State {
  checked: "unchecked" | "checked" | "indeterminate";
  label: string;
  caption: string;
  disabled: boolean;
  error: boolean;
}

const INITIAL_STATE: State = {
  checked: "unchecked",
  label: SAMPLE_LABEL,
  caption: SAMPLE_CAPTION,
  disabled: false,
  error: false,
};

// Map the tri-state string to/from the Radix checked value.
const toChecked = (c: State["checked"]): boolean | "indeterminate" =>
  c === "indeterminate" ? "indeterminate" : c === "checked";
const fromChecked = (c: boolean | "indeterminate"): State["checked"] =>
  c === "indeterminate" ? "indeterminate" : c ? "checked" : "unchecked";

// ③ Mirror exactly what the preview renders. Checkbox is controlled, so the snippet
//    always wires checked + onCheckedChange; label/caption only appear when set.
function generateCode(s: State): string {
  const lines = ["<Checkbox"];
  if (s.label) lines.push(`  label="${s.label}"`);
  if (s.caption) lines.push(`  caption="${s.caption}"`);
  lines.push("  checked={checked}");
  lines.push("  onCheckedChange={setChecked}");
  if (s.disabled) lines.push("  disabled");
  if (s.error) lines.push("  error");
  lines.push("/>");
  return lines.join("\n");
}

const CheckboxPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    {
      name: "checked",
      type: "select",
      options: ["unchecked", "checked", "indeterminate"],
      description: "Checked state (tri-state)",
    },
    { name: "label", type: "text" },
    { name: "caption", type: "text" },
    { name: "disabled", type: "boolean" },
    {
      name: "error",
      type: "boolean",
      description: "Error styling — shows when unchecked or indeterminate",
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

  // ⑤ Render the real Checkbox from state. The preview owns the checked value so the
  //    box stays interactive — clicking it (or the label) toggles state.checked, which
  //    the Select then reflects.
  const preview = (
    <div className="w-[320px] max-w-full">
      <Checkbox
        checked={toChecked(state.checked)}
        onCheckedChange={(c) => set("checked", fromChecked(c))}
        label={state.label || undefined}
        caption={state.caption || undefined}
        disabled={state.disabled}
        error={state.error}
      />
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex justify-center p-cn-3xl">
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

export default CheckboxPlayground;
