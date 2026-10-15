import { type FC, useMemo, useState } from "react";
import { Button, CopyButton, IconV2, StatusBadge, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// StatusBadge is a single, prop-driven pill: `variant` and `theme` pick its styling,
// `size` its scale, and its children are the label inside. Its wrinkle is a discriminated
// union — `icon` is only valid on non-`status` variants, and `pulse` only on the `status`
// variant — so the preview and generated code gate those two props on the chosen variant.
const ICON_OPTIONS = ["none", "info-circle", "check", "xmark"];

interface State {
  variant: "primary" | "secondary" | "outline" | "ghost" | "status";
  theme: "muted" | "success" | "warning" | "danger" | "info" | "merged" | "risk";
  size: "md" | "sm";
  icon: string;
  pulse: boolean;
  content: string;
}

const INITIAL_STATE: State = {
  variant: "primary",
  theme: "muted",
  size: "md",
  icon: "none",
  pulse: false,
  content: "Status",
};

// Mirror the preview exactly — `variant` is always emitted (it's required in the API),
// everything else only when it differs from the component defaults. `icon` and `pulse`
// are gated on the variant to match the discriminated union.
function generateCode(s: State): string {
  const attrs: string[] = [`variant="${s.variant}"`];
  if (s.theme !== "muted") attrs.push(`theme="${s.theme}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.variant === "status") {
    if (s.pulse) attrs.push("pulse");
  } else if (s.icon !== "none") {
    attrs.push(`icon="${s.icon}"`);
  }
  return `<StatusBadge ${attrs.join(" ")}>${s.content}</StatusBadge>`;
}

const StatusBadgePlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    {
      name: "variant",
      type: "select",
      options: ["primary", "secondary", "outline", "ghost", "status"],
      description: "Visual treatment of the badge",
    },
    {
      name: "theme",
      type: "select",
      options: ["muted", "success", "warning", "danger", "info", "merged", "risk"],
      description: "Color theme",
    },
    { name: "size", type: "select", options: ["md", "sm"], description: "Badge scale" },
    {
      name: "icon",
      type: "select",
      options: ICON_OPTIONS,
      description: "Leading icon (ignored on the status variant)",
    },
    { name: "content", type: "text", description: "Text shown inside the badge" },
    { name: "pulse", type: "boolean", description: "Pulsing indicator (status variant only)" },
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

  // Render the real StatusBadge from state. Two branches keep the discriminated union
  // happy: the status variant takes `pulse`, every other variant takes `icon`.
  const preview =
    state.variant === "status" ? (
      <StatusBadge variant="status" theme={state.theme} size={state.size} pulse={state.pulse}>
        {state.content}
      </StatusBadge>
    ) : (
      <StatusBadge
        variant={state.variant}
        theme={state.theme}
        size={state.size}
        icon={state.icon === "none" ? undefined : (state.icon as never)}
      >
        {state.content}
      </StatusBadge>
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

export default StatusBadgePlayground;
