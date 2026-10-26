import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Textarea,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Textarea is a leaf form primitive, so the preview is the live field itself and
// the controls configure its props. `error`/`warning` drive the theme in the
// component, so setting either will visually override the `theme` select.
// `rows`/`maxCharacters` are numbers (0 = omit), and `resizable`/`autoResize`
// toggle how the field changes height.
interface State {
  label: string;
  placeholder: string;
  caption: string;
  error: string;
  warning: string;
  tooltipContent: string;
  theme: "default" | "warning" | "danger";
  size: "md" | "sm";
  orientation: "vertical" | "horizontal";
  rows: number;
  maxCharacters: number;
  optional: boolean;
  disabled: boolean;
  resizable: boolean;
  autoResize: boolean;
}

const INITIAL_STATE: State = {
  label: "Textarea label",
  placeholder: "Placeholder",
  caption: "Caption text",
  error: "",
  warning: "",
  tooltipContent: "",
  theme: "default",
  size: "md",
  orientation: "vertical",
  rows: 4,
  maxCharacters: 0,
  optional: false,
  disabled: false,
  resizable: false,
  autoResize: false,
};

// Mirror the preview — emit props only when they differ from the defaults.
// `rows`/`maxCharacters` are numeric props, so they emit as `{n}` expressions;
// 0 means "leave it off".
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.label) attrs.push(`label="${s.label}"`);
  if (s.placeholder) attrs.push(`placeholder="${s.placeholder}"`);
  if (s.caption) attrs.push(`caption="${s.caption}"`);
  if (s.error) attrs.push(`error="${s.error}"`);
  if (s.warning) attrs.push(`warning="${s.warning}"`);
  if (s.tooltipContent) attrs.push(`tooltipContent="${s.tooltipContent}"`);
  if (s.theme !== "default") attrs.push(`theme="${s.theme}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.orientation !== "vertical")
    attrs.push(`orientation="${s.orientation}"`);
  if (s.rows > 0) attrs.push(`rows={${s.rows}}`);
  if (s.maxCharacters > 0) attrs.push(`maxCharacters={${s.maxCharacters}}`);
  if (s.optional) attrs.push("optional");
  if (s.disabled) attrs.push("disabled");
  if (s.resizable) attrs.push("resizable");
  if (s.autoResize) attrs.push("autoResize");
  if (!attrs.length) return `<Textarea />`;
  return `<Textarea\n  ${attrs.join("\n  ")}\n/>`;
}

const TextareaPlayground: FC = () => {
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
      name: "tooltipContent",
      type: "text",
      description: "Adds an info icon beside the label with this tooltip",
    },
    {
      name: "theme",
      type: "select",
      options: ["default", "warning", "danger"],
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
      name: "rows",
      type: "number",
      description: "Visible rows of text (0 to omit)",
    },
    {
      name: "maxCharacters",
      type: "number",
      description: "Show a used / max counter (0 to omit)",
    },
    {
      name: "optional",
      type: "boolean",
      description: "Remove the required * marker",
    },
    { name: "disabled", type: "boolean", description: "Disable the field" },
    {
      name: "resizable",
      type: "boolean",
      description: "Let the user drag to resize",
    },
    {
      name: "autoResize",
      type: "boolean",
      description: "Grow to fit content as you type",
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
            <Textarea
              label={state.label || undefined}
              placeholder={state.placeholder || undefined}
              caption={state.caption || undefined}
              error={state.error || undefined}
              warning={state.warning || undefined}
              tooltipContent={state.tooltipContent || undefined}
              theme={state.theme}
              size={state.size}
              orientation={state.orientation}
              rows={state.rows > 0 ? state.rows : undefined}
              maxCharacters={
                state.maxCharacters > 0 ? state.maxCharacters : undefined
              }
              optional={state.optional}
              disabled={state.disabled}
              resizable={state.resizable}
              autoResize={state.autoResize}
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

export default TextareaPlayground;
