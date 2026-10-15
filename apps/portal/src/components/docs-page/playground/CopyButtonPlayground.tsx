import { type FC, useMemo, useState } from "react";
import { Button, CopyButton, IconV2, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// CopyButton is an icon-only button that copies `name` to the clipboard and flashes
// a check. It's always iconOnly, so the controls cover its appearance plus the text
// it copies — click it in the preview to see the copied state.

// ② State — one field per control.
interface State {
  name: string;
  buttonVariant: "primary" | "secondary" | "outline" | "ai" | "ghost" | "transparent";
  size: "md" | "sm" | "xs";
  color: "inherit" | "success" | "info" | "warning" | "danger";
}

const INITIAL_STATE: State = {
  name: "npm install @harnessio/ui",
  buttonVariant: "outline",
  size: "sm",
  color: "inherit",
};

// ③ Mirror exactly what the preview renders.
function generateCode(s: State): string {
  const attrs: string[] = [`  name="${s.name}"`];
  if (s.buttonVariant !== "outline") attrs.push(`  buttonVariant="${s.buttonVariant}"`);
  if (s.size !== "sm") attrs.push(`  size="${s.size}"`);
  if (s.color !== "inherit") attrs.push(`  color="${s.color}"`);

  return ["<CopyButton", ...attrs, "/>"].join("\n");
}

const CopyButtonPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "name", type: "text", required: true, description: "Text copied to the clipboard" },
    {
      name: "buttonVariant",
      type: "select",
      options: ["primary", "secondary", "outline", "ai", "ghost", "transparent"],
    },
    { name: "size", type: "select", options: ["md", "sm", "xs"] },
    {
      name: "color",
      type: "select",
      options: ["inherit", "success", "info", "warning", "danger"],
      description: "Icon color",
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

  // ⑤ Render the real CopyButton from state, mirroring generateCode exactly.
  const preview = (
    <CopyButton
      name={state.name}
      buttonVariant={state.buttonVariant}
      size={state.size}
      color={state.color}
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

export default CopyButtonPlayground;
