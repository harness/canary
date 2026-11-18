import { type FC, useMemo, useState } from "react";
import {
  Button,
  CardSelect,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// CardSelect is a compound component whose selection lives in state and whose shape
// depends on `type` (a single value vs. an array). That controlled state and the
// composed Item children can't be expressed by the generic schema, so this is a
// bespoke playground: the controls drive Root's props plus a couple of per-Item knobs,
// and a local useState holds the current selection.

// ① Sample options shared by BOTH the preview and the generated snippet.
const OPTIONS = [
  {
    value: "a",
    icon: "git-branch" as const,
    title: "Option A",
    description: "The first choice",
  },
  {
    value: "b",
    icon: "git-commit" as const,
    title: "Option B",
    description: "The second choice",
  },
  {
    value: "c",
    icon: "git-merge" as const,
    title: "Option C",
    description: "The third choice",
  },
];

// A fresh selection value appropriate for the given type — one value for single,
// an array for multiple — so Root never gets a shape its mode can't read.
function initialSelection(type: State["type"]): unknown {
  return type === "multiple" ? ["a"] : "a";
}

// ② State — one field per control.
interface State {
  type: "single" | "multiple";
  layout: "vertical" | "horizontal" | "grid";
  gap: "xs" | "sm" | "md" | "lg";
  disabled: boolean;
  icons: boolean;
  glow: boolean;
}

const INITIAL_STATE: State = {
  type: "single",
  layout: "vertical",
  gap: "md",
  disabled: false,
  icons: true,
  glow: false,
};

// ③ Mirror exactly what the preview renders — a self-contained snippet, since the
//    selection is stateful.
function generateCode(s: State): string {
  const stateLine =
    s.type === "multiple"
      ? "  const [value, setValue] = useState<string[]>(['a'])"
      : "  const [value, setValue] = useState<string>('a')";

  const rootAttrs = [`type="${s.type}"`];
  if (s.layout !== "vertical") rootAttrs.push(`layout="${s.layout}"`);
  if (s.gap !== "md") rootAttrs.push(`gap="${s.gap}"`);
  if (s.layout === "grid") rootAttrs.push("cols={2}");
  rootAttrs.push("value={value}", "onValueChange={setValue}");
  if (s.disabled) rootAttrs.push("disabled");

  const items = OPTIONS.flatMap((o) => {
    const itemAttrs = [`value="${o.value}"`];
    if (s.icons) itemAttrs.push(`icon="${o.icon}"`);
    if (s.glow) itemAttrs.push("glow");
    return [
      `  <CardSelect.Item ${itemAttrs.join(" ")}>`,
      `    <CardSelect.Title>${o.title}</CardSelect.Title>`,
      `    <CardSelect.Description>${o.description}</CardSelect.Description>`,
      "  </CardSelect.Item>",
    ];
  });

  return [
    "() => {",
    stateLine,
    "  return (",
    `    <CardSelect.Root ${rootAttrs.join(" ")}>`,
    ...items.map((l) => `  ${l}`),
    "    </CardSelect.Root>",
    "  )",
    "}",
  ].join("\n");
}

const CardSelectPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [selected, setSelected] = useState<unknown>(() =>
    initialSelection(INITIAL_STATE.type),
  );

  const set = <K extends keyof State>(key: K, value: State[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    // Switching type changes the selection's shape (a single value vs. an array).
    // Reset it in the same update so Root never renders with a mismatched value.
    if (key === "type") setSelected(initialSelection(value as State["type"]));
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setSelected(initialSelection(INITIAL_STATE.type));
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "type", type: "select", options: ["single", "multiple"] },
    {
      name: "layout",
      type: "select",
      options: ["vertical", "horizontal", "grid"],
    },
    { name: "gap", type: "select", options: ["xs", "sm", "md", "lg"] },
    {
      name: "disabled",
      type: "boolean",
      description: "Disable the whole group",
    },
    {
      name: "icons",
      type: "boolean",
      description: "Show an icon on each item",
    },
    {
      name: "glow",
      type: "boolean",
      description: "Glow ring on the selected item",
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

  // ⑤ Render the real CardSelect from state, mirroring generateCode exactly. The
  //    value/onValueChange union is discriminated by `type`; a loosely-typed object
  //    keeps the dynamic shape from fighting the compiler.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootProps: any = {
    type: state.type,
    layout: state.layout,
    gap: state.gap,
    value: selected,
    onValueChange: setSelected,
    disabled: state.disabled,
    ...(state.layout === "grid" ? { cols: 2 } : {}),
  };

  const preview = (
    <div className="w-[420px] max-w-full">
      <CardSelect.Root {...rootProps}>
        {OPTIONS.map((o) => (
          <CardSelect.Item
            key={o.value}
            value={o.value}
            icon={state.icons ? o.icon : undefined}
            glow={state.glow}
          >
            <CardSelect.Title>{o.title}</CardSelect.Title>
            <CardSelect.Description>{o.description}</CardSelect.Description>
          </CardSelect.Item>
        ))}
      </CardSelect.Root>
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

export default CardSelectPlayground;
