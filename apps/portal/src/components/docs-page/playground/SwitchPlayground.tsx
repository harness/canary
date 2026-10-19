import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Switch,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Switch is a small controlled toggle with an optional label/caption block.
// It's a bespoke playground mainly so the preview is a *live* switch: the
// `checked` state is shared between the toggle itself and the `checked`
// control, so flipping either one moves both. The remaining controls shape the
// label block and states.

// ① The state shape — one field per control. `checked` is the live value, also
//    surfaced as a control so the panel reflects the toggle's state.
interface State {
  label: string;
  caption: string;
  captionTooltip: string;
  checked: boolean;
  showOptionalLabel: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  label: "Airplane mode",
  caption:
    "Enable or disable airplane mode to control all wireless communication.",
  captionTooltip: "",
  checked: true,
  showOptionalLabel: true,
  disabled: false,
};

// ② Turn the current state into the JSX string shown in "Show code". Emit the
//    controlled pattern (checked + onCheckedChange, matching the docs) and only
//    add props that differ from their defaults.
function generateCode(s: State): string {
  const lines = ["<Switch"];
  lines.push("  checked={checked}");
  lines.push("  onCheckedChange={setChecked}");
  if (s.label) lines.push(`  label="${s.label}"`);
  if (s.caption) lines.push(`  caption="${s.caption}"`);
  if (s.captionTooltip) lines.push(`  captionTooltip="${s.captionTooltip}"`);
  // showOptionalLabel defaults to true; false renders the required "*" marker.
  if (!s.showOptionalLabel) lines.push("  showOptionalLabel={false}");
  if (s.disabled) lines.push("  disabled");
  lines.push("/>");
  return lines.join("\n");
}

const SwitchPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, val: State[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const reset = () => setState(INITIAL_STATE);

  // ③ The curated control set.
  const controls: PropControl[] = [
    { name: "label", type: "text", description: "Text label beside the toggle" },
    { name: "caption", type: "text", description: "Secondary text below the label" },
    {
      name: "captionTooltip",
      type: "text",
      description: "Native hover title on the caption",
    },
    {
      name: "checked",
      type: "boolean",
      description: "On / off state (or click the switch)",
    },
    {
      name: "showOptionalLabel",
      type: "boolean",
      description: "Off shows a required * marker (inverted)",
    },
    { name: "disabled", type: "boolean", description: "Disable the switch" },
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

  // ④ Render the real component from state. The toggle is controlled, so
  //    clicking it drives the same `checked` state the control reads from.
  const preview = (
    <div className="w-full max-w-[420px]">
      <Switch
        id="playground-switch"
        checked={state.checked}
        onCheckedChange={(c) => set("checked", c)}
        label={state.label || undefined}
        caption={state.caption || undefined}
        captionTooltip={state.captionTooltip || undefined}
        showOptionalLabel={state.showOptionalLabel}
        disabled={state.disabled}
      />
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live switch; reset anchors to this box --- */}
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

export default SwitchPlayground;
