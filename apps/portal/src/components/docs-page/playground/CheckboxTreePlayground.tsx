import { type FC, type ReactNode, useMemo, useState } from "react";
import {
  Button,
  CheckboxTree,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// CheckboxTree is a compound component whose hierarchy is derived from JSX nesting, so
// the structure can't come from the generic schema. This bespoke playground keeps a set
// of sample trees — one per documented variation — and lets a "preset" control swap
// between them while the Root-prop toggles (Select All, count, disabled) still apply.
// Selection is live, so checking a group cascades for real.

// ① Each preset is a sample tree shared by BOTH the preview (render) and the generated
//    snippet (code) so they never drift. `defaultExpandedIds`/`initialSelected` seed the
//    tree when the preset is selected.
interface Preset {
  value: string;
  defaultExpandedIds: string[];
  initialSelected: string[];
  render: ReactNode;
  code: string;
}

const PRESETS: Preset[] = [
  {
    value: "Resources",
    defaultExpandedIds: ["resources", "pipelines"],
    initialSelected: [],
    render: (
      <CheckboxTree.Group id="resources" label="Resources">
        <CheckboxTree.Group id="pipelines" label="Pipelines">
          <CheckboxTree.Item id="audit-logs" label="Audit logs" />
          <CheckboxTree.Item id="roles" label="Roles" />
          <CheckboxTree.Item id="users" label="Users" />
        </CheckboxTree.Group>
        <CheckboxTree.Item id="resource-groups" label="Resource Groups" />
      </CheckboxTree.Group>
    ),
    code: `  <CheckboxTree.Group id="resources" label="Resources">
    <CheckboxTree.Group id="pipelines" label="Pipelines">
      <CheckboxTree.Item id="audit-logs" label="Audit logs" />
      <CheckboxTree.Item id="roles" label="Roles" />
      <CheckboxTree.Item id="users" label="Users" />
    </CheckboxTree.Group>
    <CheckboxTree.Item id="resource-groups" label="Resource Groups" />
  </CheckboxTree.Group>`,
  },
  {
    // Deeply nested groups — every level indents and aggregates its leaves.
    value: "Deeply nested",
    defaultExpandedIds: ["regions", "us", "eu"],
    initialSelected: ["us-east-prod"],
    render: (
      <CheckboxTree.Group id="regions" label="Regions">
        <CheckboxTree.Group id="us" label="United States">
          <CheckboxTree.Item id="us-east-prod" label="us-east (prod)" />
          <CheckboxTree.Item id="us-west-prod" label="us-west (prod)" />
        </CheckboxTree.Group>
        <CheckboxTree.Group id="eu" label="Europe">
          <CheckboxTree.Item id="eu-central" label="eu-central" />
          <CheckboxTree.Item id="eu-west" label="eu-west" />
        </CheckboxTree.Group>
      </CheckboxTree.Group>
    ),
    code: `  <CheckboxTree.Group id="regions" label="Regions">
    <CheckboxTree.Group id="us" label="United States">
      <CheckboxTree.Item id="us-east-prod" label="us-east (prod)" />
      <CheckboxTree.Item id="us-west-prod" label="us-west (prod)" />
    </CheckboxTree.Group>
    <CheckboxTree.Group id="eu" label="Europe">
      <CheckboxTree.Item id="eu-central" label="eu-central" />
      <CheckboxTree.Item id="eu-west" label="eu-west" />
    </CheckboxTree.Group>
  </CheckboxTree.Group>`,
  },
  {
    // Custom group icons — pass `icon` to override the default folder.
    value: "Custom icons",
    defaultExpandedIds: ["infra", "databases"],
    initialSelected: [],
    render: (
      <CheckboxTree.Group id="infra" label="Infrastructure" icon="cloud">
        <CheckboxTree.Group id="databases" label="Databases" icon="database">
          <CheckboxTree.Item id="postgres" label="Postgres" />
          <CheckboxTree.Item id="redis" label="Redis" />
        </CheckboxTree.Group>
      </CheckboxTree.Group>
    ),
    code: `  <CheckboxTree.Group id="infra" label="Infrastructure" icon="cloud">
    <CheckboxTree.Group id="databases" label="Databases" icon="database">
      <CheckboxTree.Item id="postgres" label="Postgres" />
      <CheckboxTree.Item id="redis" label="Redis" />
    </CheckboxTree.Group>
  </CheckboxTree.Group>`,
  },
  {
    // Disabled nodes — `disabled` on an individual Group/Item keeps it static.
    value: "Disabled nodes",
    defaultExpandedIds: ["resources"],
    initialSelected: [],
    render: (
      <CheckboxTree.Group id="resources" label="Resources">
        <CheckboxTree.Item id="audit-logs" label="Audit logs" />
        <CheckboxTree.Item id="roles" label="Roles (read-only)" disabled />
      </CheckboxTree.Group>
    ),
    code: `  <CheckboxTree.Group id="resources" label="Resources">
    <CheckboxTree.Item id="audit-logs" label="Audit logs" />
    <CheckboxTree.Item id="roles" label="Roles (read-only)" disabled />
  </CheckboxTree.Group>`,
  },
];

const getPreset = (value: string): Preset =>
  PRESETS.find((p) => p.value === value) ?? PRESETS[0];

// ② State — one field per control.
interface State {
  preset: string;
  showSelectAll: boolean;
  showCount: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  preset: PRESETS[0].value,
  showSelectAll: true,
  showCount: true,
  disabled: false,
};

const expandedLiteral = (ids: string[]) =>
  `[${ids.map((id) => `'${id}'`).join(", ")}]`;

// ③ Mirror exactly what the preview renders. The preset supplies the structure; the
//    toggles add Root flags only when they're on.
function generateCode(s: State): string {
  const preset = getPreset(s.preset);
  const attrs = [
    "selectedIds={selectedIds}",
    "onSelectionChange={setSelectedIds}",
    `defaultExpandedIds={${expandedLiteral(preset.defaultExpandedIds)}}`,
    `className="w-full rounded-cn-2 border border-cn-3"`,
  ];
  if (s.showSelectAll) attrs.push("showSelectAll");
  if (s.showCount) attrs.push("showCount");
  if (s.disabled) attrs.push("disabled");

  return `<CheckboxTree.Root
  ${attrs.join("\n  ")}
>
${preset.code}
</CheckboxTree.Root>`;
}

const CheckboxTreePlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  // Swapping presets changes the node ids, so re-seed the live selection to match.
  const selectPreset = (value: string) => {
    setState((prev) => ({ ...prev, preset: value }));
    setSelectedIds(getPreset(value).initialSelected);
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setSelectedIds(PRESETS[0].initialSelected);
  };

  // ④ Curated control set — the sample tree plus the meaningful Root flags.
  const controls: PropControl[] = [
    {
      name: "preset",
      type: "select",
      options: PRESETS.map((p) => p.value),
      description: "Sample tree to explore",
    },
    {
      name: "showSelectAll",
      type: "boolean",
      description: "Render a Select All row",
    },
    {
      name: "showCount",
      type: "boolean",
      description: "Show each group's leaf count",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disable the whole tree",
    },
  ];

  const inputControls = controls.filter((c) => c.type !== "boolean");
  const booleanControls = controls.filter((c) => c.type === "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) =>
        prop.name === "preset"
          ? selectPreset(v as string)
          : set(prop.name as keyof State, v as never)
      }
    />
  );

  // ⑤ Render the real tree from state, mirroring generateCode. The key is tied to the
  //    preset so switching remounts the tree with the right defaultExpandedIds.
  const preset = getPreset(state.preset);
  const preview = (
    <div className="w-[360px] max-w-full">
      <CheckboxTree.Root
        key={state.preset}
        className="w-full rounded-cn-2 border border-cn-3"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        defaultExpandedIds={preset.defaultExpandedIds}
        showSelectAll={state.showSelectAll}
        showCount={state.showCount}
        disabled={state.disabled}
      >
        {preset.render}
      </CheckboxTree.Root>
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

export default CheckboxTreePlayground;
