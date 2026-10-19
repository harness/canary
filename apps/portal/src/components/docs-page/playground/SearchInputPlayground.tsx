import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  SearchInput,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// SearchInput is a single input, but its behaviour only shows when you actually
// type: the onChange is debounced, and the match-navigation controls (prev /
// next / clear) appear once there's text. So this is a bespoke playground — the
// preview is genuinely usable (type in it), tracks the debounced value for live
// feedback, and drives a working counter when navigation is enabled.

// A mock result count so the counter + nav buttons have something real to cycle.
const MOCK_TOTAL = 128;

// ① The state shape — one field per control.
interface State {
  placeholder: string;
  size: "md" | "sm";
  theme: "default" | "success" | "danger" | "warning";
  showPrevNextButtons: boolean;
  disabled: boolean;
  readOnly: boolean;
}

const INITIAL_STATE: State = {
  placeholder: "Search pipelines…",
  size: "md",
  theme: "default",
  showPrevNextButtons: false,
  disabled: false,
  readOnly: false,
};

// ② Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from defaults, and mirror the preview exactly — including
//    the live counter value when navigation is on and there's a query.
function generateCode(s: State, liveCounter: string): string {
  const attrs: string[] = [`placeholder="${s.placeholder}"`];
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.theme !== "default") attrs.push(`theme="${s.theme}"`);
  if (s.disabled) attrs.push("disabled");
  if (s.readOnly) attrs.push("readOnly");
  attrs.push("onChange={(value) => setQuery(value)}");
  if (s.showPrevNextButtons) {
    attrs.push("showPrevNextButtons");
    if (liveCounter) attrs.push(`counter="${liveCounter}"`);
    attrs.push("onNext={handleNext}");
    attrs.push("onPrev={handlePrev}");
  }

  return `<SearchInput\n  ${attrs.join("\n  ")}\n/>`;
}

const SearchInputPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // The debounced value + match index are driven by real interaction, not
  // controls — type and navigate to watch them change.
  const [query, setQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  // Bumped on reset to remount SearchInput (it owns its text internally, so this
  // is the clean way to clear the field without controlling it on every keystroke).
  const [resetNonce, setResetNonce] = useState(0);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setQuery("");
    setMatchIndex(0);
    setResetNonce((n) => n + 1);
  };

  const total = query ? MOCK_TOTAL : 0;
  const counter = total ? `${matchIndex + 1}/${total}` : "";

  const handleNext = () => setMatchIndex((i) => (i < total - 1 ? i + 1 : 0));
  const handlePrev = () => setMatchIndex((i) => (i > 0 ? i - 1 : total - 1));

  // ③ The curated control set.
  const controls: PropControl[] = [
    { name: "placeholder", type: "text", description: "Placeholder text" },
    {
      name: "size",
      type: "select",
      options: ["md", "sm"],
      description: "Input size",
    },
    {
      name: "theme",
      type: "select",
      options: ["default", "success", "danger", "warning"],
      description: "Validation styling",
    },
    {
      name: "showPrevNextButtons",
      type: "boolean",
      description: "Show prev/next/clear once there's text (adds a counter)",
    },
    { name: "disabled", type: "boolean", description: "Disable the input" },
    { name: "readOnly", type: "boolean", description: "Make the input read-only" },
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

  // ④ Render the real component from state. The field is live — type in it. Keep
  //    every condition aligned with generateCode so preview and snippet agree.
  const preview = (
    <div className="flex w-full max-w-[420px] flex-col gap-cn-md">
      <SearchInput
        key={`search-${resetNonce}`}
        placeholder={state.placeholder}
        size={state.size}
        theme={state.theme}
        disabled={state.disabled}
        readOnly={state.readOnly}
        onChange={(value) => {
          setQuery(value);
          setMatchIndex(0);
        }}
        showPrevNextButtons={state.showPrevNextButtons}
        counter={state.showPrevNextButtons ? counter : undefined}
        onNext={handleNext}
        onPrev={handlePrev}
        onEnter={(_text, reverse) => (reverse ? handlePrev() : handleNext())}
      />
      <div className="rounded-cn-3 border p-cn-sm">
        <div className="text-cn-size-2 text-cn-2 font-medium">
          Debounced value
        </div>
        <p className="mt-cn-3xs font-body-code text-cn-size-2">
          {query || "(empty)"}
        </p>
      </div>
    </div>
  );

  const code = useMemo(
    () => generateCode(state, counter),
    [state, counter],
  );

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live input; reset anchors to this box --- */}
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

export default SearchInputPlayground;
