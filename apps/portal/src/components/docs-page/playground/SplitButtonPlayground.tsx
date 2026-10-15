import { type FC, useMemo, useState } from "react";
import { Button, CopyButton, IconV2, SplitButton, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// SplitButton pairs a primary action with a dropdown of alternates. It's always
// controlled: the dropdown options and (in radio mode) the selected option are
// owned by the parent. The playground keeps that selection in its own state so the
// radio behavior is live, and the controls drive the button's appearance.

const THEMED_VARIANTS = ["primary", "outline", "secondary"];

// Fixed sample options, shared by the preview and the generated snippet.
const OPTIONS = [
  { value: "merge", label: "Create a merge commit" },
  { value: "squash", label: "Squash and merge" },
  { value: "rebase", label: "Rebase and merge" },
];

const OPTIONS_CODE = `  options={[
    { value: 'merge', label: 'Create a merge commit' },
    { value: 'squash', label: 'Squash and merge' },
    { value: 'rebase', label: 'Rebase and merge' },
  ]}`;

// ② State — one field per control.
interface State {
  variant: "primary" | "outline" | "secondary";
  theme: "default" | "success" | "danger" | "warning";
  size: "md" | "sm" | "xs";
  radio: boolean;
  loading: boolean;
  disabled: boolean;
  disableButton: boolean;
  disableDropdown: boolean;
}

const INITIAL_STATE: State = {
  variant: "primary",
  theme: "default",
  size: "md",
  radio: false,
  loading: false,
  disabled: false,
  disableButton: false,
  disableDropdown: false,
};

// ③ Mirror exactly what the preview renders. selectedValue appears only in radio
//    mode, and theme only for variants that render it.
function generateCode(s: State, selected: string): string {
  const attrs: string[] = [];
  if (s.variant !== "primary") attrs.push(`  variant="${s.variant}"`);
  if (THEMED_VARIANTS.includes(s.variant) && s.theme !== "default") attrs.push(`  theme="${s.theme}"`);
  if (s.size !== "md") attrs.push(`  size="${s.size}"`);
  if (s.radio) attrs.push(`  selectedValue="${selected}"`);
  if (s.loading) attrs.push("  loading");
  if (s.disabled) attrs.push("  disabled");
  if (s.disableButton) attrs.push("  disableButton");
  if (s.disableDropdown) attrs.push("  disableDropdown");

  return [
    "<SplitButton",
    ...attrs,
    "  handleButtonClick={() => {}}",
    "  handleOptionChange={(value) => {}}",
    OPTIONS_CODE,
    ">",
    "  Merge pull request",
    "</SplitButton>",
  ].join("\n");
}

const SplitButtonPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [selected, setSelected] = useState<string>(OPTIONS[0].value);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setSelected(OPTIONS[0].value);
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "variant", type: "select", options: ["primary", "outline", "secondary"] },
    { name: "theme", type: "select", options: ["default", "success", "danger", "warning"] },
    { name: "size", type: "select", options: ["md", "sm", "xs"] },
    { name: "radio", type: "boolean", description: "Radio mode (track the selected option)" },
    { name: "loading", type: "boolean", description: "Show a loading spinner" },
    { name: "disabled", type: "boolean", description: "Disable the whole control" },
    { name: "disableButton", type: "boolean", description: "Disable only the main button" },
    { name: "disableDropdown", type: "boolean", description: "Disable only the dropdown" },
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

  // ⑤ Render the real SplitButton from state, mirroring generateCode exactly.
  const theme = THEMED_VARIANTS.includes(state.variant) ? state.theme : undefined;
  const preview = (
    <SplitButton
      variant={state.variant}
      theme={theme}
      size={state.size}
      selectedValue={state.radio ? selected : undefined}
      loading={state.loading}
      disabled={state.disabled}
      disableButton={state.disableButton}
      disableDropdown={state.disableDropdown}
      handleButtonClick={() => {}}
      handleOptionChange={setSelected}
      options={OPTIONS}
    >
      Merge pull request
    </SplitButton>
  );

  const code = useMemo(() => generateCode(state, selected), [state, selected]);

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

export default SplitButtonPlayground;
