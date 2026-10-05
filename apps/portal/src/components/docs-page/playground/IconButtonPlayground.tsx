import { type FC, useMemo, useState } from "react";
import { Button, CopyButton, IconV2, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// An "icon button" is the Button component with `iconOnly` and an <IconV2> child —
// not a standalone export — so this is a bespoke playground: the icon is a
// ReactNode child and tooltipProps is an object, neither of which the generic
// schema-driven primitive controls can express.

// ① Curated icon names (all verified against IconV2's icon set).
const ICON_NAMES = [
  "plus",
  "check",
  "search",
  "download",
  "trash",
  "edit-pencil",
  "info-circle",
  "more-vert",
  "nav-arrow-right",
  "expand",
];

// ② State — one field per control.
interface State {
  icon: string;
  variant: "primary" | "secondary" | "outline" | "ai" | "ghost" | "link" | "transparent";
  size: "md" | "sm" | "xs" | "2xs" | "3xs";
  tooltip: string;
  ignoreIconOnlyTooltip: boolean;
  rounded: boolean;
  loading: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  icon: "plus",
  variant: "primary",
  size: "md",
  tooltip: "Add",
  ignoreIconOnlyTooltip: false,
  rounded: false,
  loading: false,
  disabled: false,
};

// ③ Mirror exactly what the preview renders. The accessibility contract: an
//    iconOnly button needs EITHER tooltipProps OR ignoreIconOnlyTooltip, so the
//    two are emitted as mutually exclusive — same branch the preview takes.
function generateCode(s: State): string {
  const attrs: string[] = ["iconOnly"];
  if (s.variant !== "primary") attrs.push(`variant="${s.variant}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.rounded) attrs.push("rounded");
  if (s.loading) attrs.push("loading");
  if (s.disabled) attrs.push("disabled");
  if (s.ignoreIconOnlyTooltip) {
    attrs.push("ignoreIconOnlyTooltip");
  } else {
    attrs.push(`tooltipProps={{ content: "${s.tooltip}" }}`);
  }

  return `<Button ${attrs.join(" ")}>\n  <IconV2 name="${s.icon}" />\n</Button>`;
}

const IconButtonPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "icon", type: "select", options: ICON_NAMES, required: true },
    {
      name: "variant",
      type: "select",
      options: ["primary", "secondary", "outline", "ai", "ghost", "link", "transparent"],
    },
    { name: "size", type: "select", options: ["md", "sm", "xs", "2xs", "3xs"] },
    {
      name: "tooltip",
      type: "text",
      description: "Tooltip content (ignored when ignoreIconOnlyTooltip is on)",
    },
    {
      name: "ignoreIconOnlyTooltip",
      type: "boolean",
      description: "Opt out of the required tooltip",
    },
    { name: "rounded", type: "boolean", description: "Fully rounded button" },
    { name: "loading", type: "boolean", description: "Show a loading spinner" },
    { name: "disabled", type: "boolean", description: "Disable the button" },
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

  // ⑤ Render the real Button from state. tooltipProps / ignoreIconOnlyTooltip are
  //    mutually exclusive — exactly what generateCode emits.
  const tooltipBehavior = state.ignoreIconOnlyTooltip
    ? { ignoreIconOnlyTooltip: true as const }
    : { tooltipProps: { content: state.tooltip } };

  const preview = (
    <Button
      iconOnly
      variant={state.variant}
      size={state.size}
      rounded={state.rounded}
      loading={state.loading}
      disabled={state.disabled}
      {...tooltipBehavior}
    >
      <IconV2 name={state.icon} />
    </Button>
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

export default IconButtonPlayground;
