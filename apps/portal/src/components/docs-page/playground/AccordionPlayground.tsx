import { type FC, useMemo, useState } from "react";
import {
  Accordion,
  Button,
  CopyButton,
  IconV2,
  LogoSymbol,
  LogoV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// ① Sample content shared by BOTH the live preview and the generated snippet,
//    so the two never drift.
const SAMPLE_PREFIX_ICON = "info-circle";
const SAMPLE_PREFIX_LOGO = "docker";
const SAMPLE_SUFFIX = "3 items";

// The `prefix` prop takes any ReactNode — these are the kinds the playground
// can drop in, matching the icon/logo prefixes shown in the static examples.
type PrefixKind = "none" | "icon" | "logo" | "symbol";

// JSX string per prefix kind, shared by preview + "Show code" so they never drift.
const PREFIX_JSX: Record<Exclude<PrefixKind, "none">, string> = {
  icon: `<IconV2 name="${SAMPLE_PREFIX_ICON}" size="md" />`,
  logo: `<LogoV2 name="${SAMPLE_PREFIX_LOGO}" size="md" />`,
  symbol: `<LogoSymbol name="${SAMPLE_PREFIX_LOGO}" size="md" />`,
};

// Live-node per prefix kind — mirrors PREFIX_JSX exactly.
function prefixNode(kind: PrefixKind) {
  switch (kind) {
    case "icon":
      return <IconV2 name={SAMPLE_PREFIX_ICON} size="md" />;
    case "logo":
      return <LogoV2 name={SAMPLE_PREFIX_LOGO} size="md" />;
    case "symbol":
      return <LogoSymbol name={SAMPLE_PREFIX_LOGO} size="md" />;
    default:
      return undefined;
  }
}
// Three items keep the single/multiple distinction meaningful. Their trigger
// label and panel body come from the `label` / `content` controls, with the
// 1-based index appended so each row stays distinct.
const ITEM_VALUES = ["item-1", "item-2", "item-3"];

function buildItems(s: Pick<State, "label" | "content">) {
  return ITEM_VALUES.map((value, i) => ({
    value,
    label: `${s.label} ${i + 1}`,
    body: `${s.content} ${i + 1}`,
  }));
}

// ② The state shape — one field per control.
interface State {
  type: "single" | "multiple";
  size: "sm" | "md";
  variant: "default" | "card";
  cardSize: "sm" | "md" | "lg";
  indicatorPosition: "left" | "right";
  collapsible: boolean;
  disabled: boolean;
  prefix: PrefixKind;
  showSuffix: boolean;
  trailingAction: boolean;
  label: string;
  content: string;
}

// ② Defaults, hoisted so the reset button can reuse them.
const INITIAL_STATE: State = {
  type: "single",
  size: "sm",
  variant: "default",
  cardSize: "md",
  indicatorPosition: "right",
  collapsible: true,
  disabled: false,
  prefix: "none",
  showSuffix: false,
  trailingAction: false,
  label: "Item",
  content: "This is the content of item",
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Only emit props that differ from the component defaults, and mirror exactly
//    what the preview renders.
function generateCode(s: State): string {
  const rootAttrs: string[] = [`type="${s.type}"`];
  if (s.type === "single" && s.collapsible) rootAttrs.push("collapsible");
  if (s.size !== "sm") rootAttrs.push(`size="${s.size}"`);
  if (s.variant !== "default") rootAttrs.push(`variant="${s.variant}"`);
  if (s.variant === "card" && s.cardSize !== "md")
    rootAttrs.push(`cardSize="${s.cardSize}"`);
  if (s.indicatorPosition !== "right")
    rootAttrs.push(`indicatorPosition="${s.indicatorPosition}"`);
  if (s.disabled) rootAttrs.push("disabled");
  rootAttrs.push(
    s.type === "single" ? `defaultValue="item-1"` : `defaultValue={["item-1"]}`,
  );

  const triggerExtras = [
    s.prefix !== "none"
      ? `\n        prefix={${PREFIX_JSX[s.prefix]}}`
      : "",
    s.showSuffix ? `\n        suffix="${SAMPLE_SUFFIX}"` : "",
  ].join("");
  const triggerOpen = triggerExtras
    ? `<Accordion.Trigger${triggerExtras}\n      >`
    : `<Accordion.Trigger>`;

  const items = buildItems(s).map((it) => {
    // An outlined icon button (CopyButton defaults to variant="outline") sits
    // AFTER the label inside the trigger children — the supported combination
    // shown in the "left indicator" static example.
    const children = s.trailingAction
      ? `\n        ${it.label}\n        <CopyButton size="xs" className="ml-cn-sm" name="${it.body}" />\n      `
      : it.label;
    return `    <Accordion.Item value="${it.value}">
      ${triggerOpen}${children}</Accordion.Trigger>
      <Accordion.Content>
        <p>${it.body}</p>
      </Accordion.Content>
    </Accordion.Item>`;
  }).join("\n");

  return `<Accordion.Root ${rootAttrs.join(" ")}>\n${items}\n</Accordion.Root>`;
}

const AccordionPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "type",
      type: "select",
      options: ["single", "multiple"],
      required: true,
      description: "One open item at a time, or several",
    },
    {
      name: "label",
      type: "text",
      description: "Trigger text (the item number is appended)",
    },
    {
      name: "content",
      type: "text",
      description: "Panel body (the item number is appended)",
    },
    { name: "size", type: "select", options: ["sm", "md"] },
    { name: "variant", type: "select", options: ["default", "card"] },
    {
      name: "cardSize",
      type: "select",
      options: ["sm", "md", "lg"],
      description: "Only applies when variant is card",
    },
    {
      name: "indicatorPosition",
      type: "select",
      options: ["left", "right"],
    },
    {
      name: "prefix",
      type: "select",
      options: ["none", "icon", "logo", "symbol"],
      description: "Any ReactNode before the label — icon, logo, or symbol",
    },
    {
      name: "collapsible",
      type: "boolean",
      description: "Allow closing the open item (type single only)",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disable the whole accordion",
    },
    {
      name: "showSuffix",
      type: "boolean",
      description: "Show supporting text after each label",
    },
    {
      name: "trailingAction",
      type: "boolean",
      description:
        "Interactive control after the label (shown here as a copy button)",
    },
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the select controls.
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

  // ⑤ Render the real component from state. `key={state.type}` remounts the Root
  //    when the type switches so the uncontrolled defaultValue picks up the right
  //    shape (string vs array) without controlled/uncontrolled warnings.
  const prefix = prefixNode(state.prefix);
  const suffix = state.showSuffix ? SAMPLE_SUFFIX : undefined;
  const items = buildItems(state);

  const preview = (
    <Accordion.Root
      key={state.type}
      type={state.type}
      size={state.size}
      variant={state.variant}
      indicatorPosition={state.indicatorPosition}
      disabled={state.disabled || undefined}
      {...(state.variant === "card" ? { cardSize: state.cardSize } : {})}
      {...(state.type === "single"
        ? { collapsible: state.collapsible, defaultValue: "item-1" }
        : { defaultValue: ["item-1"] })}
    >
      {items.map((it) => (
        <Accordion.Item key={it.value} value={it.value}>
          <Accordion.Trigger prefix={prefix} suffix={suffix}>
            {it.label}
            {state.trailingAction && (
              <CopyButton size="xs" className="ml-cn-sm" name={it.body} />
            )}
          </Accordion.Trigger>
          <Accordion.Content>
            <p>{it.body}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
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

          <div className="w-full max-w-xl">{preview}</div>
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

export default AccordionPlayground;
