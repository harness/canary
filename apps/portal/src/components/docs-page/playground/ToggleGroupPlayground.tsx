import { type FC, useMemo, useState } from "react";
import { Button, CopyButton, IconV2, ToggleGroup, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// ToggleGroup is a set of related toggles with a shared selection — single pick
// (a segmented control) or multiple. The Root owns the selection internally and
// reseeds from `value` whenever `value` or `type` changes, so switching type or
// resetting remounts a fresh Root via the `key`.

const ITEMS = [
  { value: "list", text: "List", icon: "list" },
  { value: "board", text: "Board", icon: "kanban-board" },
  { value: "timeline", text: "Timeline", icon: "calendar" },
];

const SELECTED_VARIANT_VARIANTS = ["outline", "ghost"];

// ② State — one field per control.
interface State {
  type: "single" | "multiple";
  variant: "outline" | "ghost" | "transparent";
  selectedVariant: "primary" | "secondary";
  size: "md" | "sm" | "xs";
  orientation: "horizontal" | "vertical";
  iconOnly: boolean;
  unselectable: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  type: "single",
  variant: "outline",
  selectedVariant: "primary",
  size: "md",
  orientation: "horizontal",
  iconOnly: false,
  unselectable: false,
  disabled: false,
};

// The group starts with the first item selected.
const seedValue = (type: State["type"]) => (type === "multiple" ? [ITEMS[0].value] : ITEMS[0].value);

// ③ Mirror exactly what the preview renders.
function generateCode(s: State): string {
  const rootAttrs: string[] = [];
  if (s.type !== "single") rootAttrs.push(`  type="${s.type}"`);
  if (s.variant !== "outline") rootAttrs.push(`  variant="${s.variant}"`);
  if (SELECTED_VARIANT_VARIANTS.includes(s.variant) && s.selectedVariant !== "primary") {
    rootAttrs.push(`  selectedVariant="${s.selectedVariant}"`);
  }
  if (s.size !== "md") rootAttrs.push(`  size="${s.size}"`);
  if (s.orientation !== "horizontal") rootAttrs.push(`  orientation="${s.orientation}"`);
  if (s.unselectable) rootAttrs.push("  unselectable");
  if (s.disabled) rootAttrs.push("  disabled");
  const seed = s.type === "multiple" ? `{['${ITEMS[0].value}']}` : `"${ITEMS[0].value}"`;
  rootAttrs.push(`  value=${seed}`);

  const items = ITEMS.map((item) => {
    if (s.iconOnly) {
      return `  <ToggleGroup.Item value="${item.value}" iconOnly prefixIcon="${item.icon}" tooltipProps={{ content: '${item.text}' }} />`;
    }
    return `  <ToggleGroup.Item value="${item.value}" text="${item.text}" prefixIcon="${item.icon}" />`;
  });

  return ["<ToggleGroup.Root", ...rootAttrs, ">", ...items, "</ToggleGroup.Root>"].join("\n");
}

const ToggleGroupPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [resetKey, setResetKey] = useState(0);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setResetKey((k) => k + 1);
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "type", type: "select", options: ["single", "multiple"] },
    { name: "variant", type: "select", options: ["outline", "ghost", "transparent"] },
    {
      name: "selectedVariant",
      type: "select",
      options: ["primary", "secondary"],
      description: "Ignored by the transparent variant",
    },
    { name: "size", type: "select", options: ["md", "sm", "xs"] },
    { name: "orientation", type: "select", options: ["horizontal", "vertical"] },
    { name: "iconOnly", type: "boolean", description: "Render items as icons only" },
    { name: "unselectable", type: "boolean", description: "Keep at least one item selected" },
    { name: "disabled", type: "boolean", description: "Disable the whole group" },
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

  // ⑤ Render the real ToggleGroup from state. Remount on type/reset so the Root
  //    reseeds its internal selection cleanly.
  const selectedVariant = SELECTED_VARIANT_VARIANTS.includes(state.variant)
    ? state.selectedVariant
    : undefined;

  const preview = (
    <ToggleGroup.Root
      key={`${state.type}-${resetKey}`}
      type={state.type}
      variant={state.variant}
      selectedVariant={selectedVariant}
      size={state.size}
      orientation={state.orientation}
      unselectable={state.unselectable}
      disabled={state.disabled}
      value={seedValue(state.type) as never}
    >
      {ITEMS.map((item) =>
        state.iconOnly ? (
          <ToggleGroup.Item
            key={item.value}
            value={item.value}
            iconOnly
            prefixIcon={item.icon}
            tooltipProps={{ content: item.text }}
          />
        ) : (
          <ToggleGroup.Item key={item.value} value={item.value} text={item.text} prefixIcon={item.icon} />
        ),
      )}
    </ToggleGroup.Root>
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

export default ToggleGroupPlayground;
