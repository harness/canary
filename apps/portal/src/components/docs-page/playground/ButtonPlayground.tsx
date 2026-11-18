import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// The base text Button. A leading icon is a ReactNode child (not a prop), so this
// is a bespoke playground: the icon + label children can't be expressed by the
// generic primitive controls. Icon-only usage lives on its own Icon Button page.

// ① Curated leading-icon names (verified against IconV2's set); "none" omits it.
const ICON_NAMES = [
  "none",
  "plus",
  "check",
  "download",
  "trash",
  "nav-arrow-right",
];

// Variants that actually render a theme. ai / link / transparent ignore it.
const THEMED_VARIANTS = ["primary", "secondary", "outline", "ghost"];

// ② State — one field per control.
interface State {
  label: string;
  variant:
    | "primary"
    | "secondary"
    | "outline"
    | "ai"
    | "ghost"
    | "link"
    | "transparent";
  theme: "default" | "success" | "danger" | "warning";
  size: "md" | "sm" | "xs";
  icon: string;
  loading: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  label: "Button",
  variant: "primary",
  theme: "default",
  size: "md",
  icon: "none",
  loading: false,
  disabled: false,
};

// ③ Mirror exactly what the preview renders. theme is only emitted for variants
//    that support it; a leading icon becomes an <IconV2> child before the label.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.variant !== "primary") attrs.push(`variant="${s.variant}"`);
  if (THEMED_VARIANTS.includes(s.variant) && s.theme !== "default")
    attrs.push(`theme="${s.theme}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.loading) attrs.push("loading");
  if (s.disabled) attrs.push("disabled");

  const open = attrs.length ? `<Button ${attrs.join(" ")}>` : "<Button>";

  if (s.icon !== "none") {
    return `${open}\n  <IconV2 name="${s.icon}" />\n  ${s.label}\n</Button>`;
  }
  return `${open}${s.label}</Button>`;
}

const ButtonPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "label", type: "text", required: true },
    {
      name: "variant",
      type: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ai",
        "ghost",
        "link",
        "transparent",
      ],
    },
    {
      name: "theme",
      type: "select",
      options: ["default", "success", "danger", "warning"],
      description: "Ignored by ai, link, and transparent",
    },
    { name: "size", type: "select", options: ["md", "sm", "xs"] },
    {
      name: "icon",
      type: "select",
      options: ICON_NAMES,
      description: "Leading icon ('none' omits it)",
    },
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

  // ⑤ Render the real Button from state, mirroring generateCode exactly.
  const theme = THEMED_VARIANTS.includes(state.variant)
    ? state.theme
    : undefined;
  const preview = (
    <Button
      variant={state.variant}
      theme={theme}
      size={state.size}
      loading={state.loading}
      disabled={state.disabled}
    >
      {state.icon !== "none" && <IconV2 name={state.icon as never} />}
      {state.label}
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

export default ButtonPlayground;
