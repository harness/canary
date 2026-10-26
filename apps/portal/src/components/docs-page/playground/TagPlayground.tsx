import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Tag,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Tag is a single, prop-driven pill: `value` is the label, `variant`/`theme`/`size`
// pick its styling, and a handful of optional parts (a leading `icon`, a `label` key
// segment that turns it into a split tag, a trailing `actionIcon` button) layer on.
// It's a bespoke playground mainly because two props aren't plain primitives: a split
// tag is implied by passing BOTH `label` and `value`, and the removable action is an
// `actionIcon` + `onActionClick` pair. The preview and generated code gate both the
// same way so the snippet never lies.
const THEME_OPTIONS = [
  "gray",
  "blue",
  "brown",
  "cyan",
  "green",
  "forest-green",
  "indigo",
  "lime",
  "mint",
  "orange",
  "pink",
  "purple",
  "red",
  "violet",
  "yellow",
];
const VARIANT_OPTIONS = ["outline", "secondary"];
const SIZE_OPTIONS = ["md", "sm"];
const ICON_OPTIONS = ["none", "label", "plus", "info-circle", "check"];

// ① The state shape — one field per control. `type` picks between the two tag
//    shapes: a plain tag (just `value`) or a split tag (a `label` key segment +
//    the `value`). The component infers "split" from receiving both props, so the
//    playground makes that an explicit choice instead of a side effect of typing.
interface State {
  type: "default" | "split";
  value: string;
  label: string;
  variant: "outline" | "secondary";
  size: "md" | "sm";
  theme: string;
  icon: string;
  removable: boolean;
  enableHover: boolean;
  disabled: boolean;
}

// ② Defaults. Starts as a plain tag; switch `type` to "split" to reveal the
//    key (`label`) segment.
const INITIAL_STATE: State = {
  type: "default",
  value: "Production",
  label: "Env",
  variant: "secondary",
  size: "md",
  theme: "green",
  icon: "none",
  removable: false,
  enableHover: false,
  disabled: false,
};

// ③ Mirror the preview exactly. A split tag emits `label` (its presence alongside
//    `value` is what makes the component render split); `value` is always emitted.
//    Everything else only when it differs from the component defaults, and
//    `removable` expands to the actionIcon + onActionClick pair.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.type === "split") attrs.push(`label="${s.label}"`);
  attrs.push(`value="${s.value}"`);
  if (s.variant !== "outline") attrs.push(`variant="${s.variant}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.theme !== "gray") attrs.push(`theme="${s.theme}"`);
  if (s.icon !== "none") attrs.push(`icon="${s.icon}"`);
  if (s.removable) {
    attrs.push('actionIcon="xmark"');
    attrs.push("onActionClick={() => remove()}");
  }
  if (s.enableHover) attrs.push("enableHover");
  if (s.disabled) attrs.push("disabled");

  if (attrs.length === 1) return `<Tag ${attrs[0]} />`;
  return `<Tag\n  ${attrs.join("\n  ")}\n/>`;
}

const TagPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ The curated control set. The `label` key field only appears for a split
  //    tag — on a default tag it has no effect, so showing it would mislead.
  const controls: PropControl[] = [
    {
      name: "type",
      type: "select",
      options: ["default", "split"],
      description: "Plain tag or key / value split",
    },
    {
      name: "value",
      type: "text",
      required: true,
      description:
        state.type === "split" ? "Value segment (right)" : "The tag's text",
    },
    ...(state.type === "split"
      ? [
          {
            name: "label",
            type: "text" as const,
            required: true,
            description: "Key segment (left)",
          },
        ]
      : []),
    {
      name: "variant",
      type: "select",
      options: VARIANT_OPTIONS,
      description: "Visual style",
    },
    {
      name: "size",
      type: "select",
      options: SIZE_OPTIONS,
      description: "Tag scale",
    },
    {
      name: "theme",
      type: "select",
      options: THEME_OPTIONS,
      description: "Color theme",
    },
    {
      name: "icon",
      type: "select",
      options: ICON_OPTIONS,
      description: "Leading icon (sits with the key in a split tag)",
    },
    {
      name: "removable",
      type: "boolean",
      description: "Add a trailing ✕ action button",
    },
    {
      name: "enableHover",
      type: "boolean",
      description: "Hover styling without an onClick",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Dim the tag and disable the action",
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

  // ⑤ Render the real Tag from state. `label` is passed only for a split tag (its
  //    presence alongside `value` is what triggers split rendering); `removable`
  //    expands to the actionIcon pair with a no-op handler (the snippet shows where
  //    real remove logic would go).
  const preview = (
    <Tag
      value={state.value}
      label={state.type === "split" ? state.label : undefined}
      variant={state.variant}
      size={state.size}
      theme={state.theme as never}
      icon={state.icon === "none" ? undefined : (state.icon as never)}
      enableHover={state.enableHover}
      disabled={state.disabled}
      actionIcon={state.removable ? ("xmark" as never) : undefined}
      onActionClick={state.removable ? () => {} : undefined}
    />
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex min-h-[120px] items-center justify-center p-cn-3xl">
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

export default TagPlayground;
