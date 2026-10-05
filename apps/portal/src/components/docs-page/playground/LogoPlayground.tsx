import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  LogoSymbol,
  LogoV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// LogoV2 (full-color brand mark) and LogoSymbol (monochrome, inherits currentColor)
// share the same name + size API, so this bespoke playground folds both into one
// card with a component toggle — something the generic schema-driven Playground
// can't do, since it resolves a single component by name.

// Names that exist in BOTH LogoNameMapV2 and SymbolNameMap, so the toggle never
// lands on a name one of the two components can't render.
const SHARED_NAMES = [
  "harness",
  "github",
  "gitlab",
  "bitbucket",
  "docker",
  "kubernetes",
  "terraform",
  "ansible",
  "jenkins",
  "aws",
  "azure",
  "python",
  "jira",
  "slack",
];

interface State {
  component: "LogoV2" | "LogoSymbol";
  name: string;
  size: "xs" | "sm" | "md" | "lg";
}

const INITIAL_STATE: State = {
  component: "LogoV2",
  name: "harness",
  size: "lg",
};

// Mirror exactly what the preview renders.
function generateCode(s: State): string {
  const attrs = [`name="${s.name}"`];
  if (s.size !== "lg") attrs.push(`size="${s.size}"`);
  return `<${s.component} ${attrs.join(" ")} />`;
}

const LogoPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    {
      name: "component",
      type: "select",
      options: ["LogoV2", "LogoSymbol"],
      description: "Full-color logo, or monochrome symbol that inherits color",
    },
    {
      name: "name",
      type: "select",
      options: SHARED_NAMES,
      required: true,
      description: "Full catalog lives in the logo gallery (Foundations → Logos)",
    },
    { name: "size", type: "select", options: ["xs", "sm", "md", "lg"] },
  ];

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // LogoSymbol is monochrome and paints with currentColor, so render it against
  // the preview's foreground color to show it inheriting from its parent.
  const preview =
    state.component === "LogoV2" ? (
      <LogoV2 name={state.name} size={state.size} />
    ) : (
      <span className="text-cn-1">
        <LogoSymbol name={state.name} size={state.size} />
      </span>
    );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
    <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
      {/* --- Preview stage --- */}
      <div className="bg-cn-2 relative flex min-h-[8rem] items-center justify-center p-cn-3xl">
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

export default LogoPlayground;
