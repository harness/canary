import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Toggle,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Toggle is a two-state button. It manages its own pressed state, but the playground
// tracks `selected` itself so Reset can clear it. The iconOnly variant is a separate
// type arm (it requires prefixIcon + a tooltip and forbids suffixIcon), so the JSX
// and the generated code branch on it.

const ICON_NAMES = ["none", "star", "bell", "eye", "bookmark"];

// selectedVariant has no effect on the transparent variant.
const SELECTED_VARIANT_VARIANTS = ["outline", "ghost"];

// ② State — one field per control.
interface State {
  text: string;
  variant: "outline" | "ghost" | "transparent";
  selectedVariant: "primary" | "secondary";
  size: "md" | "sm" | "xs";
  prefixIcon: string;
  suffixIcon: string;
  iconOnly: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  text: "Toggle",
  variant: "outline",
  selectedVariant: "primary",
  size: "md",
  prefixIcon: "none",
  suffixIcon: "none",
  iconOnly: false,
  disabled: false,
};

// In iconOnly mode a prefix icon is mandatory, so fall back to one if "none".
const effectivePrefix = (s: State): string =>
  s.iconOnly && s.prefixIcon === "none" ? "star" : s.prefixIcon;

// ③ Mirror exactly what the preview renders.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.variant !== "outline") attrs.push(`  variant="${s.variant}"`);
  if (
    SELECTED_VARIANT_VARIANTS.includes(s.variant) &&
    s.selectedVariant !== "primary"
  ) {
    attrs.push(`  selectedVariant="${s.selectedVariant}"`);
  }
  if (s.size !== "md") attrs.push(`  size="${s.size}"`);

  const prefix = effectivePrefix(s);

  if (s.iconOnly) {
    attrs.push("  iconOnly");
    attrs.push(`  prefixIcon="${prefix}"`);
    attrs.push(`  tooltipProps={{ content: '${s.text}' }}`);
  } else {
    attrs.push(`  text="${s.text}"`);
    if (prefix !== "none") attrs.push(`  prefixIcon="${prefix}"`);
    if (s.suffixIcon !== "none") attrs.push(`  suffixIcon="${s.suffixIcon}"`);
  }

  if (s.disabled) attrs.push("  disabled");

  return ["<Toggle", ...attrs, "/>"].join("\n");
}

const TogglePlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [selected, setSelected] = useState(false);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setSelected(false);
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    {
      name: "text",
      type: "text",
      required: true,
      description: "Label (and tooltip when iconOnly)",
    },
    {
      name: "variant",
      type: "select",
      options: ["outline", "ghost", "transparent"],
    },
    {
      name: "selectedVariant",
      type: "select",
      options: ["primary", "secondary"],
      description: "Ignored by the transparent variant",
    },
    { name: "size", type: "select", options: ["md", "sm", "xs"] },
    { name: "prefixIcon", type: "select", options: ICON_NAMES },
    {
      name: "suffixIcon",
      type: "select",
      options: ICON_NAMES,
      description: "Not available when iconOnly",
    },
    {
      name: "iconOnly",
      type: "boolean",
      description: "Render only the prefix icon",
    },
    { name: "disabled", type: "boolean", description: "Disable the toggle" },
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

  // ⑤ Render the real Toggle from state. iconOnly is a distinct type arm, so branch.
  const selectedVariant = SELECTED_VARIANT_VARIANTS.includes(state.variant)
    ? state.selectedVariant
    : undefined;
  const prefix = effectivePrefix(state);

  const preview = state.iconOnly ? (
    <Toggle
      variant={state.variant}
      selectedVariant={selectedVariant}
      size={state.size}
      iconOnly
      prefixIcon={prefix as never}
      tooltipProps={{ content: state.text }}
      disabled={state.disabled}
      selected={selected}
      onChange={setSelected}
    />
  ) : (
    <Toggle
      variant={state.variant}
      selectedVariant={selectedVariant}
      size={state.size}
      text={state.text}
      prefixIcon={prefix === "none" ? undefined : (prefix as never)}
      suffixIcon={
        state.suffixIcon === "none" ? undefined : (state.suffixIcon as never)
      }
      disabled={state.disabled}
      selected={selected}
      onChange={setSelected}
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

export default TogglePlayground;
