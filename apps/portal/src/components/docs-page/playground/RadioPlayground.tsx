import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Radio,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Radio is a compound component — Radio.Root owns the group context + selection,
// and each Radio.Item is one option. The controls drive the group-level props on
// Radio.Root while a fixed set of sample items renders inside it, so this is a
// bespoke playground: the preview manages the selected value itself and the
// generated snippet mirrors it exactly.

// ① Sample options shared by BOTH the preview and the generated snippet so the two
//    never drift.
interface SampleItem {
  value: string;
  label: string;
  caption: string;
}
const SAMPLE_ITEMS: ReadonlyArray<SampleItem> = [
  {
    value: "everyone",
    label: "Everyone",
    caption: "Anyone with the link can view",
  },
  { value: "team", label: "Only my team", caption: "People in your workspace" },
  { value: "me", label: "Only me", caption: "Just you can see this" },
];
const INITIAL_VALUE = "everyone";

// ② The state shape — one field per control (group-level Radio.Root props).
interface State {
  label: string;
  caption: string;
  tooltipContent: string;
  orientation: "vertical" | "horizontal";
  optional: boolean;
  disabled: boolean;
  error: boolean;
}

const INITIAL_STATE: State = {
  label: "Visibility",
  caption: "Choose who can see this",
  tooltipContent: "",
  orientation: "vertical",
  optional: false,
  disabled: false,
  error: false,
};

// ③ Turn the current state into the JSX string shown in "Show code". Only emit
//    props that are actually set, and mirror the preview exactly — same items,
//    same group props.
function generateCode(s: State): string {
  const attrs: string[] = ["value={value}", "onValueChange={setValue}"];

  if (s.label) attrs.push(`label="${s.label}"`);
  if (s.caption) attrs.push(`caption="${s.caption}"`);
  if (s.tooltipContent) attrs.push(`tooltipContent="${s.tooltipContent}"`);
  if (s.orientation !== "vertical")
    attrs.push(`orientation="${s.orientation}"`);
  if (s.optional) attrs.push("optional");
  if (s.disabled) attrs.push("disabled");
  if (s.error) attrs.push("error");

  const items = SAMPLE_ITEMS.map(
    (it) =>
      `  <Radio.Item value="${it.value}" label="${it.label}" caption="${it.caption}" />`,
  ).join("\n");

  return `<Radio.Root\n  ${attrs.join("\n  ")}\n>\n${items}\n</Radio.Root>`;
}

const RadioPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // Selection lives outside the control state so the group is genuinely usable.
  const [value, setValue] = useState<string>(INITIAL_VALUE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setValue(INITIAL_VALUE);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    { name: "label", type: "text", description: "Empty hides the group label" },
    { name: "caption", type: "text", description: "Empty hides the prop" },
    {
      name: "tooltipContent",
      type: "text",
      description: "Adds an info tooltip to the label; empty hides it",
    },
    {
      name: "orientation",
      type: "select",
      options: ["vertical", "horizontal"],
      description: "Layout direction of the items and group label",
    },
    {
      name: "optional",
      type: "boolean",
      description:
        "Show an 'optional' tag (on the label, or each item if no label)",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disable the whole group",
    },
    { name: "error", type: "boolean", description: "Apply error styling" },
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the text/select controls.
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

  // ⑤ Render the real component from state. Keep every condition aligned with
  //    generateCode so preview and snippet agree.
  const preview = (
    <div className="w-full max-w-[400px]">
      <Radio.Root
        value={value}
        onValueChange={setValue}
        label={state.label || undefined}
        caption={state.caption || undefined}
        tooltipContent={state.tooltipContent || undefined}
        orientation={state.orientation}
        optional={state.optional}
        disabled={state.disabled}
        error={state.error}
      >
        {SAMPLE_ITEMS.map((it) => (
          <Radio.Item
            key={it.value}
            value={it.value}
            label={it.label}
            caption={it.caption}
          />
        ))}
      </Radio.Root>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live group; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[200px] items-center justify-center p-cn-3xl">
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

export default RadioPlayground;
