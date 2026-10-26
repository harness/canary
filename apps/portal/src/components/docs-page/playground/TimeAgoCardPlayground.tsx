import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Text,
  TimeAgoCard,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// TimeAgoCard renders a relative timestamp ("2 hr. ago") whose tooltip reveals the
// full date. Its headline prop is `timestamp`, which isn't something you'd type by
// hand, so this bespoke playground swaps it for an `offset` select of common
// relative times: each option carries both a millisecond delta (to build a live
// Date for the preview) and the matching `new Date(Date.now() ...)` expression for
// the generated snippet, so the code stays copy-pasteable and honest.
interface Offset {
  label: string;
  ms: number;
  expr: string;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const OFFSETS: Offset[] = [
  {
    label: "30 seconds ago",
    ms: -30 * SECOND,
    expr: "new Date(Date.now() - 30 * 1000).toISOString()",
  },
  {
    label: "3 minutes ago",
    ms: -3 * MINUTE,
    expr: "new Date(Date.now() - 3 * 60 * 1000).toISOString()",
  },
  {
    label: "2 hours ago",
    ms: -2 * HOUR,
    expr: "new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "1 day ago",
    ms: -1 * DAY,
    expr: "new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "5 days ago",
    ms: -5 * DAY,
    expr: "new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "2 weeks ago",
    ms: -14 * DAY,
    expr: "new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "2 months ago",
    ms: -60 * DAY,
    expr: "new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "2 years ago",
    ms: -730 * DAY,
    expr: "new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "in 1 day",
    ms: 1 * DAY,
    expr: "new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "in 3 months",
    ms: 90 * DAY,
    expr: "new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()",
  },
  {
    label: "in 1 year",
    ms: 365 * DAY,
    expr: "new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()",
  },
];

const OFFSET_OPTIONS = OFFSETS.map((o) => o.label);
const getOffset = (label: string) =>
  OFFSETS.find((o) => o.label === label) ?? OFFSETS[2];

interface State {
  offset: string;
  prefix: string;
  live: boolean;
}

const INITIAL_STATE: State = {
  offset: "2 hours ago",
  prefix: "",
  live: false,
};

// Mirror the preview — `timestamp` is always emitted (as the chosen relative-time
// expression); `prefix`/`live` only when they differ from the defaults.
function generateCode(s: State): string {
  const attrs: string[] = [`timestamp={${getOffset(s.offset).expr}}`];
  if (s.prefix) attrs.push(`prefix="${s.prefix}"`);
  if (s.live) attrs.push("live");
  if (attrs.length === 1) return `<TimeAgoCard ${attrs[0]} />`;
  return `<TimeAgoCard\n  ${attrs.join("\n  ")}\n/>`;
}

const TimeAgoCardPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    {
      name: "offset",
      type: "select",
      options: OFFSET_OPTIONS,
      description: "Relative time to display (sets timestamp)",
    },
    {
      name: "prefix",
      type: "text",
      description: "Text shown before the time (e.g. Updated)",
    },
    {
      name: "live",
      type: "boolean",
      description: "Re-render every second to stay current",
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

  // Build a live timestamp from the chosen offset. `live` keys the TimeAgoCard so
  // toggling it cleanly restarts the component's internal interval.
  const timestamp = useMemo(
    () => new Date(Date.now() + getOffset(state.offset).ms).toISOString(),
    [state.offset],
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex min-h-[120px] flex-col items-center justify-center gap-cn-xs p-cn-3xl">
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

          <TimeAgoCard
            key={state.live ? "live" : "static"}
            timestamp={timestamp}
            prefix={state.prefix || undefined}
            live={state.live}
          />
          <Text variant="caption-normal" color="foreground-3">
            Hover or focus to see the full date
          </Text>
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

export default TimeAgoCardPlayground;
