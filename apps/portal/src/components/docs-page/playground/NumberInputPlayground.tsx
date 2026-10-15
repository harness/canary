import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  NumberInput,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// NumberInput is a leaf form primitive, so the preview is the live field itself
// and the controls configure its props. `error`/`warning` drive the theme in the
// component, so setting either will visually override the `theme` select.
interface State {
  label: string;
  placeholder: string;
  caption: string;
  error: string;
  warning: string;
  theme: "default" | "success" | "warning" | "danger";
  size: "md" | "sm";
  orientation: "vertical" | "horizontal";
  step: number;
  integerOnly: boolean;
  hideStepper: boolean;
  optional: boolean;
  disabled: boolean;
  readOnly: boolean;
}

const INITIAL_STATE: State = {
  label: "Quantity",
  placeholder: "Enter a number",
  caption: "",
  error: "",
  warning: "",
  theme: "default",
  size: "md",
  orientation: "vertical",
  step: 1,
  integerOnly: false,
  hideStepper: false,
  optional: false,
  disabled: false,
  readOnly: false,
};

// Mirror the preview — emit props only when they differ from the defaults.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.label) attrs.push(`label="${s.label}"`);
  if (s.placeholder) attrs.push(`placeholder="${s.placeholder}"`);
  if (s.caption) attrs.push(`caption="${s.caption}"`);
  if (s.error) attrs.push(`error="${s.error}"`);
  if (s.warning) attrs.push(`warning="${s.warning}"`);
  if (s.theme !== "default") attrs.push(`theme="${s.theme}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.orientation !== "vertical")
    attrs.push(`orientation="${s.orientation}"`);
  if (s.step !== 1) attrs.push(`step={${s.step}}`);
  if (s.integerOnly) attrs.push("integerOnly");
  if (s.hideStepper) attrs.push("hideStepper");
  if (s.optional) attrs.push("optional");
  if (s.disabled) attrs.push("disabled");
  if (s.readOnly) attrs.push("readOnly");
  if (!attrs.length) return `<NumberInput />`;
  return `<NumberInput\n  ${attrs.join("\n  ")}\n/>`;
}

const NumberInputPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    { name: "label", type: "text", description: "Label text above the field" },
    {
      name: "placeholder",
      type: "text",
      description: "Placeholder shown when empty",
    },
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
      name: "theme",
      type: "select",
      options: ["default", "success", "warning", "danger"],
      description: "Visual state (error/warning override this)",
    },
    {
      name: "size",
      type: "select",
      options: ["md", "sm"],
      description: "Field height",
    },
    {
      name: "orientation",
      type: "select",
      options: ["vertical", "horizontal"],
      description: "Label position relative to the field",
    },
    {
      name: "step",
      type: "number",
      description: "Amount the steppers add/subtract",
    },
    {
      name: "integerOnly",
      type: "boolean",
      description: "Block decimal points",
    },
    {
      name: "hideStepper",
      type: "boolean",
      description: "Hide the increment/decrement buttons",
    },
    {
      name: "optional",
      type: "boolean",
      description: "Remove the required * marker",
    },
    { name: "disabled", type: "boolean", description: "Disable the field" },
    {
      name: "readOnly",
      type: "boolean",
      description: "Make the field read-only (hides steppers)",
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

          <div className="w-[420px] max-w-full">
            <NumberInput
              label={state.label || undefined}
              placeholder={state.placeholder || undefined}
              caption={state.caption || undefined}
              error={state.error || undefined}
              warning={state.warning || undefined}
              theme={state.theme}
              size={state.size}
              orientation={state.orientation}
              step={state.step}
              integerOnly={state.integerOnly}
              hideStepper={state.hideStepper}
              optional={state.optional}
              disabled={state.disabled}
              readOnly={state.readOnly}
            />
          </div>
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

export default NumberInputPlayground;
