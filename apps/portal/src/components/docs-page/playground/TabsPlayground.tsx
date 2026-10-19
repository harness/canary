import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Tabs,
  Text,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Tabs is a compound component — Root holds a List of Triggers plus matching
// Content panels. A scalar control can't express that, so this is a bespoke
// playground: the preview renders a real, switchable tabbed interface and the
// controls shape the whole group (the List variant, Root orientation, and what
// each Trigger shows). The active tab is controlled so the preview and the
// generated code stay in step.

// The three tabs the preview maps over. Icons reuse names already used across
// the docs. `counter`/`badge` are attached per-tab but only surface when the
// matching control is on.
const TABS = [
  {
    value: "overview",
    label: "Overview",
    icon: "info-circle",
    logo: "github",
    counter: null as number | null,
    content: "Summary of the pipeline, recent runs, and health at a glance.",
  },
  {
    value: "activity",
    label: "Activity",
    icon: "git-branch",
    logo: "gitlab",
    counter: 3,
    content: "A chronological feed of commits, deployments, and events.",
  },
  {
    value: "settings",
    label: "Settings",
    icon: "settings",
    logo: "bitbucket",
    counter: null as number | null,
    content: "Configuration for triggers, variables, and access control.",
  },
];

const VARIANT_OPTIONS = ["underlined", "overlined", "ghost", "outlined"];
const ORIENTATION_OPTIONS = ["horizontal", "vertical"];
// Leading glyph is a single choice because `icon` and `logo` are mutually
// exclusive on a Trigger — a tri-state select enforces that for free.
const LEADING_OPTIONS = ["none", "icon", "logo"];

// ① The state shape — one field per control.
interface State {
  active: string;
  variant: string;
  orientation: string;
  leading: string;
  counter: boolean;
  badge: boolean;
  disabledLast: boolean;
}

const INITIAL_STATE: State = {
  active: "overview",
  variant: "underlined",
  orientation: "horizontal",
  leading: "icon",
  counter: true,
  badge: false,
  disabledLast: false,
};

// ② Build the compound JSX string shown in "Show code". The List maps over a
//    `tabs` array (how it'd really be used), so trigger props are emitted once
//    inside the map. Only non-default props appear.
function generateCode(s: State): string {
  const rootProps: string[] = [" value={active}", " onValueChange={setActive}"];
  if (s.orientation === "vertical") rootProps.push(' orientation="vertical"');

  const listProps: string[] = [];
  if (s.variant !== "underlined") listProps.push(` variant="${s.variant}"`);

  const lines: string[] = [`<Tabs.Root${rootProps.join("")}>`];
  lines.push(`  <Tabs.List${listProps.join("")}>`);
  lines.push("    {tabs.map((tab) => (");

  const triggerProps: string[] = ["        value={tab.value}"];
  if (s.leading === "icon") triggerProps.push("        icon={tab.icon}");
  else if (s.leading === "logo") triggerProps.push("        logo={tab.logo}");
  if (s.counter) triggerProps.push("        counter={tab.counter}");
  if (s.badge) triggerProps.push('        badge="New"');
  if (s.disabledLast)
    triggerProps.push('        disabled={tab.value === "settings"}');

  lines.push("      <Tabs.Trigger");
  lines.push("        key={tab.value}");
  triggerProps.forEach((l) => lines.push(l));
  lines.push("      >");
  lines.push("        {tab.label}");
  lines.push("      </Tabs.Trigger>");
  lines.push("    ))}");
  lines.push("  </Tabs.List>");
  lines.push("  {tabs.map((tab) => (");
  lines.push("    <Tabs.Content key={tab.value} value={tab.value}>");
  lines.push("      <Text>{tab.content}</Text>");
  lines.push("    </Tabs.Content>");
  lines.push("  ))}");
  lines.push("</Tabs.Root>");
  return lines.join("\n");
}

const TabsPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, val: State[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const reset = () => setState(INITIAL_STATE);

  // ③ The curated control set.
  const controls: PropControl[] = [
    {
      name: "variant",
      type: "select",
      options: VARIANT_OPTIONS,
      description: "List: visual style",
    },
    {
      name: "orientation",
      type: "select",
      options: ORIENTATION_OPTIONS,
      description: "Root: layout direction",
    },
    {
      name: "leading",
      type: "select",
      options: LEADING_OPTIONS,
      description: "Trigger: leading icon or logo",
    },
    {
      name: "counter",
      type: "boolean",
      description: "Trigger: counter badge",
    },
    {
      name: "badge",
      type: "boolean",
      description: "Trigger: status badge",
    },
    {
      name: "disabledLast",
      type: "boolean",
      description: "Disable the Settings tab",
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

  // ④ Render the real compound from state. The active tab is controlled, so
  //    clicking a trigger drives the same `active` state the code reads from.
  const preview = (
    <div className="w-full max-w-[520px]">
      <Tabs.Root
        className="grid gap-cn-sm"
        value={state.active}
        onValueChange={(v) => set("active", v)}
        orientation={state.orientation as never}
      >
        <Tabs.List variant={state.variant as never}>
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              icon={state.leading === "icon" ? (tab.icon as never) : undefined}
              logo={state.leading === "logo" ? (tab.logo as never) : undefined}
              counter={state.counter ? tab.counter : undefined}
              badge={state.badge ? "New" : undefined}
              disabled={state.disabledLast && tab.value === "settings"}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {TABS.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            <Text>{tab.content}</Text>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live tabs; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[220px] items-center justify-center p-cn-3xl">
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

export default TabsPlayground;
