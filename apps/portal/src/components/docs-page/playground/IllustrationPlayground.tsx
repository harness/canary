import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  Illustration,
  IllustrationsNameMap,
  IconV2,
  TextInput,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Like Icon, Illustration's defining prop — `name` — is backed by a map, so this
// is a bespoke playground: a searchable gallery picks the name (clicking a glyph
// sets it, so the value is always valid) and the remaining props use the generic
// controls. The `-light` entries are theme variants the component swaps in on its
// own via `themeDependent`, so they're hidden from the picker.
const ALL_NAMES = Object.keys(IllustrationsNameMap)
  .filter((n) => !n.endsWith("-light"))
  .sort();

interface State {
  name: string;
  size: number;
  themeDependent: boolean;
}

const INITIAL_STATE: State = {
  name: "no-data-folder",
  size: 112,
  themeDependent: false,
};

// Mirror the preview — emit props only when they differ from the defaults
// (size 112, themeDependent false).
function generateCode(s: State): string {
  const attrs = [`name="${s.name}"`];
  if (s.size !== 112) attrs.push(`size={${s.size}}`);
  if (s.themeDependent) attrs.push("themeDependent");
  return `<Illustration ${attrs.join(" ")} />`;
}

const IllustrationPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [query, setQuery] = useState("");

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setQuery("");
  };

  const controls: PropControl[] = [
    {
      name: "size",
      type: "number",
      description: "Size in pixels (applied to both width and height)",
    },
    {
      name: "themeDependent",
      type: "boolean",
      description: "Use a light-theme variant (or invert) when the site is in light mode",
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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL_NAMES.filter((n) => n.includes(q)) : ALL_NAMES;
  }, [query]);

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex flex-col items-center gap-cn-sm p-cn-3xl">
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

          <div className="flex min-h-[160px] items-center justify-center">
            <Illustration
              name={state.name as never}
              size={state.size}
              themeDependent={state.themeDependent}
            />
          </div>
          <span className="font-body-code text-cn-size-1 text-cn-3">name="{state.name}"</span>
        </div>

        {/* --- Illustration picker: search + clickable gallery --- */}
        <div className="bg-cn-1 flex flex-col gap-cn-sm border-t p-cn-md">
          <TextInput
            label="name"
            caption="Search the illustration set — click one to select it"
            placeholder="Search illustrations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid max-h-72 grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-cn-3xs overflow-auto">
            {matches.map((n) => {
              const selected = n === state.name;
              return (
                <button
                  key={n}
                  type="button"
                  title={n}
                  onClick={() => set("name", n)}
                  className={`flex aspect-square items-center justify-center rounded-cn-2 border p-cn-3xs ${
                    selected ? "border-cn-borders-2 bg-cn-2" : "border-transparent hover:bg-cn-2"
                  }`}
                >
                  <Illustration name={n as never} size={56} />
                </button>
              );
            })}
          </div>
          <span className="text-cn-size-1 text-cn-3">
            {matches.length} illustration{matches.length === 1 ? "" : "s"}
          </span>
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

export default IllustrationPlayground;
