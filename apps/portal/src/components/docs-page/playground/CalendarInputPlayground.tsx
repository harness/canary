import { type FC, useMemo, useState } from "react";
import {
  Button,
  CalendarInputView,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// CalendarInputView is a read-only text field that opens a Calendar popover; the picked
// date is owned by the caller through `value` / `setValue`. That controlled state can't
// be expressed by the generic schema-driven controls, so this is a bespoke playground:
// `placeholder` is the one real knob, and a local useState holds the selected value so
// the field actually updates when you pick a date.

// ② State — one field per control.
interface State {
  placeholder: string;
}

const INITIAL_STATE: State = {
  placeholder: "Select date",
};

// ③ Mirror exactly what the preview renders — a self-contained snippet, since the
//    value is stateful.
function generateCode(s: State): string {
  return [
    "() => {",
    "  const [value, setValue] = useState<string>('')",
    "  return (",
    "    <CalendarInputView",
    "      value={value}",
    "      setValue={(date) => setValue(date.toISOString())}",
    `      placeholder="${s.placeholder}"`,
    "    />",
    "  )",
    "}",
  ].join("\n");
}

const CalendarInputPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setValue("");
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    {
      name: "placeholder",
      type: "text",
      description: "Text shown before a date is picked",
    },
  ];

  const inputControls = controls.filter((c) => c.type !== "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ⑤ Render the real CalendarInputView from state, mirroring generateCode exactly.
  const preview = (
    <div className="w-64">
      <CalendarInputView
        value={value}
        setValue={(date) => setValue(date.toISOString())}
        placeholder={state.placeholder}
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

        {/* --- Control grid: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
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

export default CalendarInputPlayground;
