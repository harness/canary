import { type FC, useMemo, useState } from "react";
import {
  Button,
  CounterBadge,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// CounterBadge is a single, prop-driven element: `variant` and `theme` pick its styling,
// and its children are the count shown inside. Its one wrinkle is that the content is
// children (a ReactNode) rather than a prop, which the generic schema can't express — so
// this is a small bespoke playground driving variant, theme, and the count text.

// ① Sample content shared by BOTH the preview and the generated snippet.
const SAMPLE_CONTENT = "42";

// ② State — one field per control.
interface State {
  variant: "outline" | "secondary";
  theme: "default" | "info" | "success" | "danger";
  content: string;
}

const INITIAL_STATE: State = {
  variant: "outline",
  theme: "default",
  content: SAMPLE_CONTENT,
};

// ③ Mirror exactly what the preview renders. Emit a prop only when it differs from its
//    default, so the snippet stays as short as the configuration allows.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.variant !== "outline") attrs.push(`variant="${s.variant}"`);
  if (s.theme !== "default") attrs.push(`theme="${s.theme}"`);
  const open = attrs.length
    ? `<CounterBadge ${attrs.join(" ")}>`
    : "<CounterBadge>";
  return `${open}${s.content}</CounterBadge>`;
}

const CounterBadgePlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "variant", type: "select", options: ["outline", "secondary"] },
    {
      name: "theme",
      type: "select",
      options: ["default", "info", "success", "danger"],
    },
    {
      name: "content",
      type: "text",
      description: "Count shown inside the badge",
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

  // ⑤ Render the real CounterBadge from state, mirroring generateCode exactly.
  const preview = (
    <CounterBadge variant={state.variant} theme={state.theme}>
      {state.content}
    </CounterBadge>
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

export default CounterBadgePlayground;
