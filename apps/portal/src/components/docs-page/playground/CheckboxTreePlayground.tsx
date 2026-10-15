import { type FC, useMemo, useState } from "react";
import { Button, CheckboxTree, CopyButton, IconV2, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// CheckboxTree is a compound component whose hierarchy is derived from JSX nesting, so
// the structure can't come from the generic schema. This bespoke playground keeps a
// fixed sample tree and lets the controls drive Root's props (Select All, count, and
// disabled); the selection itself is live, so checking a group cascades for real.

// ① The sample tree, shared by BOTH the preview and the generated snippet so they never
//    drift. The ids here are what land in `selectedIds`.
const SAMPLE_TREE = (
  <>
    <CheckboxTree.Group id="resources" label="Resources">
      <CheckboxTree.Group id="pipelines" label="Pipelines">
        <CheckboxTree.Item id="audit-logs" label="Audit logs" />
        <CheckboxTree.Item id="roles" label="Roles" />
        <CheckboxTree.Item id="users" label="Users" />
      </CheckboxTree.Group>
      <CheckboxTree.Item id="resource-groups" label="Resource Groups" />
    </CheckboxTree.Group>
  </>
);

const SAMPLE_TREE_CODE = `  <CheckboxTree.Group id="resources" label="Resources">
    <CheckboxTree.Group id="pipelines" label="Pipelines">
      <CheckboxTree.Item id="audit-logs" label="Audit logs" />
      <CheckboxTree.Item id="roles" label="Roles" />
      <CheckboxTree.Item id="users" label="Users" />
    </CheckboxTree.Group>
    <CheckboxTree.Item id="resource-groups" label="Resource Groups" />
  </CheckboxTree.Group>`;

const DEFAULT_EXPANDED = ["resources", "pipelines"];

// ② State — one field per control.
interface State {
  showSelectAll: boolean;
  showCount: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  showSelectAll: true,
  showCount: true,
  disabled: false,
};

// ③ Mirror exactly what the preview renders. The selection + structure are fixed; the
//    controls add Root flags only when they're on.
function generateCode(s: State): string {
  const attrs = [
    "selectedIds={selectedIds}",
    "onSelectionChange={setSelectedIds}",
    `defaultExpandedIds={['resources', 'pipelines']}`,
    `className="w-full rounded-cn-2 border border-cn-3"`,
  ];
  if (s.showSelectAll) attrs.push("showSelectAll");
  if (s.showCount) attrs.push("showCount");
  if (s.disabled) attrs.push("disabled");

  return `<CheckboxTree.Root
  ${attrs.join("\n  ")}
>
${SAMPLE_TREE_CODE}
</CheckboxTree.Root>`;
}

const CheckboxTreePlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setSelectedIds([]);
  };

  // ④ Curated control set — the meaningful Root flags.
  const controls: PropControl[] = [
    { name: "showSelectAll", type: "boolean", description: "Render a Select All row" },
    { name: "showCount", type: "boolean", description: "Show each group's leaf count" },
    { name: "disabled", type: "boolean", description: "Disable the whole tree" },
  ];

  const booleanControls = controls.filter((c) => c.type === "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ⑤ Render the real tree from state, mirroring generateCode. Selection is live, so
  //    checking a group cascades and parents show the mixed state for real.
  const preview = (
    <div className="w-[360px] max-w-full">
      <CheckboxTree.Root
        className="w-full rounded-cn-2 border border-cn-3"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        defaultExpandedIds={DEFAULT_EXPANDED}
        showSelectAll={state.showSelectAll}
        showCount={state.showCount}
        disabled={state.disabled}
      >
        {SAMPLE_TREE}
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

        {/* --- Control grid: bg-cn-1 surface, max 3 per row --- */}
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
