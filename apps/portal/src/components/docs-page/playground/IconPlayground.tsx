import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconNameMapV2,
  IconV2,
  IconWithTooltip,
  TextInput,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// IconV2 is a leaf primitive, but its defining prop — `name` — has 500+ possible
// values, which no select can usefully hold. So this is a bespoke playground: a
// searchable gallery picks the name (clicking a glyph sets it, so the value is
// always valid), and the remaining primitive props use the generic controls.

// Every icon name, straight from the component's own map.
const ALL_NAMES = Object.keys(IconNameMapV2).sort();
// Cap how many glyphs render at once so the grid stays compact; searching narrows it.
const MAX_VISIBLE = 10;

// ② State — one field per control.
interface State {
  name: string;
  size: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
  color: "inherit" | "neutral" | "danger" | "warning" | "success" | "info" | "risk" | "merged";
  skipSize: boolean;
  tooltip: string;
}

const INITIAL_STATE: State = {
  name: "star",
  size: "lg",
  color: "inherit",
  skipSize: false,
  tooltip: "",
};

// ③ Mirror exactly what the preview renders — emit props only when they differ
//    from the component defaults (size 'sm', color 'inherit', skipSize false).
//    With a tooltip set, the icon is wrapped in `IconWithTooltip`, so the icon
//    props move into its `iconProps`.
function generateCode(s: State): string {
  const iconProps = [`name: "${s.name}"`];
  if (s.size !== "sm") iconProps.push(`size: "${s.size}"`);
  if (s.color !== "inherit") iconProps.push(`color: "${s.color}"`);
  if (s.skipSize) iconProps.push("skipSize: true");

  if (s.tooltip?.trim()) {
    return `<IconWithTooltip\n  content="${s.tooltip}"\n  iconProps={{ ${iconProps.join(", ")} }}\n/>`;
  }

  const attrs = [`name="${s.name}"`];
  if (s.size !== "sm") attrs.push(`size="${s.size}"`);
  if (s.color !== "inherit") attrs.push(`color="${s.color}"`);
  if (s.skipSize) attrs.push("skipSize");
  return `<IconV2 ${attrs.join(" ")} />`;
}

const IconPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [query, setQuery] = useState("");

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setQuery("");
  };

  // ④ The non-name controls use the generic schema-driven fields.
  const controls: PropControl[] = [
    {
      name: "size",
      type: "select",
      options: ["2xs", "xs", "sm", "md", "lg", "xl"],
      description: "Predefined size variant",
    },
    {
      name: "color",
      type: "select",
      options: ["inherit", "neutral", "danger", "warning", "success", "info", "risk", "merged"],
      description: "Semantic icon color ('inherit' matches surrounding text)",
    },
    {
      name: "tooltip",
      type: "text",
      description: "Wrap in IconWithTooltip, showing this text on hover (empty = plain icon)",
    },
    {
      name: "skipSize",
      type: "boolean",
      description: "Skip the size classes when you size the icon yourself",
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

  // The searchable name list — filter, then cap for rendering.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL_NAMES.filter((n) => n.includes(q)) : ALL_NAMES;
  }, [query]);
  const visible = matches.slice(0, MAX_VISIBLE);

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

          <div className="flex min-h-16 items-center justify-center">
            {state.tooltip.trim() ? (
              <IconWithTooltip
                content={state.tooltip}
                iconProps={{
                  name: state.name as never,
                  size: state.size,
                  color: state.color,
                  skipSize: state.skipSize,
                }}
              />
            ) : (
              <IconV2
                name={state.name as never}
                size={state.size}
                color={state.color}
                skipSize={state.skipSize}
              />
            )}
          </div>
          <span className="font-body-code text-cn-size-1 text-cn-3">name="{state.name}"</span>
        </div>

        {/* --- Icon picker: search + clickable gallery --- */}
        <div className="bg-cn-1 flex flex-col gap-cn-sm border-t p-cn-md">
          <TextInput
            label="name"
            caption="Search the full icon set — click a glyph to select it"
            placeholder="Search icons…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid max-h-56 grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-cn-3xs overflow-auto">
            {visible.map((n) => {
              const selected = n === state.name;
              return (
                <button
                  key={n}
                  type="button"
                  title={n}
                  onClick={() => set("name", n)}
                  className={`flex aspect-square items-center justify-center rounded-cn-2 border ${
                    selected ? "border-cn-borders-2 bg-cn-2" : "border-transparent hover:bg-cn-2"
                  }`}
                >
                  <IconV2 name={n as never} />
                </button>
              );
            })}
          </div>
          <span className="text-cn-size-1 text-cn-3">
            {matches.length > MAX_VISIBLE
              ? `Showing ${MAX_VISIBLE} of ${matches.length} — keep typing to narrow`
              : `${matches.length} icon${matches.length === 1 ? "" : "s"}`}
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

export default IconPlayground;
