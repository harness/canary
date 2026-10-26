import { type FC, type ReactNode, useMemo, useState } from "react";
import {
  Button,
  CollapseButton,
  CopyButton,
  File,
  Folder,
  IconV2,
  Tree,
  TooltipProvider,
  type TreeViewElement,
} from "@harnessio/ui/components";
import { ExecutionState } from "@harnessio/ui/types";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// TreeView is a compositional compound component (Tree > Folder / File), not a
// prop-driven one — you build a tree by nesting parts, each carrying its own
// `status`, `level`, and optional `duration`. So this is a bespoke playground:
// one representative CI/CD execution tree stays fully interactive (expand/collapse
// folders, click a row to select it) while the Tree-level props are exposed as
// controls. The scroll, selection, and full-pipeline examples stay on the page —
// they demonstrate behaviour a single tree + controls can't.

// ① The sample tree, shared by BOTH the preview and the generated snippet. The
//    statuses cover the common states (running / success / pending / failure).
const SAMPLE_TREE: TreeViewElement[] = [
  {
    id: "pipeline-main",
    name: "Main Pipeline",
    status: ExecutionState.RUNNING,
    duration: "15m 45s",
    children: [
      {
        id: "stage-build",
        name: "Build Stage",
        status: ExecutionState.SUCCESS,
        duration: "5m 20s",
        children: [
          {
            id: "step-install",
            name: "Install Dependencies",
            status: ExecutionState.SUCCESS,
            duration: "45s",
          },
          {
            id: "step-compile",
            name: "Run Compiler",
            status: ExecutionState.SUCCESS,
            duration: "1m 30s",
          },
        ],
      },
      {
        id: "stage-test",
        name: "Test Stage",
        status: ExecutionState.RUNNING,
        duration: "8m 15s",
        children: [
          {
            id: "unit-tests",
            name: "Unit Tests",
            status: ExecutionState.SUCCESS,
            duration: "3m 20s",
          },
          {
            id: "integration-tests",
            name: "Integration Tests",
            status: ExecutionState.RUNNING,
            duration: "4m 55s",
          },
          {
            id: "e2e-tests",
            name: "E2E Tests",
            status: ExecutionState.PENDING,
          },
        ],
      },
    ],
  },
  {
    id: "pipeline-hotfix",
    name: "Hotfix Pipeline",
    status: ExecutionState.FAILURE,
    duration: "4m 12s",
    children: [
      {
        id: "quick-build",
        name: "Quick Build",
        status: ExecutionState.SUCCESS,
        duration: "1m 45s",
      },
      {
        id: "critical-test",
        name: "Critical Path Test",
        status: ExecutionState.FAILURE,
        duration: "2m 27s",
      },
    ],
  },
];

// Only the top-level pipelines start expanded, so the stage folders begin closed.
// Picking a row then auto-expands the path down to it — the behaviour the
// `selectedId` control is there to show. Fixed (not a control) but mirrored into
// the snippet.
const INITIAL_EXPANDED = ["pipeline-main", "pipeline-hotfix"];

// The selectable file rows, offered by the `selectedId` control. Selection only
// highlights File rows (folders are structural), so these are all files.
const FILE_IDS = [
  "step-install",
  "step-compile",
  "unit-tests",
  "integration-tests",
  "e2e-tests",
  "quick-build",
  "critical-test",
];

const isFolder = (node: TreeViewElement) =>
  Array.isArray(node.children) && node.children.length > 0;

// ② State — one field per control.
interface State {
  dir: "ltr" | "rtl";
  selectedId: string;
  indicator: boolean;
  showDurations: boolean;
  nonSelectable: boolean;
  collapseButton: boolean;
}

const INITIAL_STATE: State = {
  dir: "ltr",
  selectedId: "unit-tests",
  indicator: true,
  showDurations: true,
  nonSelectable: false,
  collapseButton: false,
};

// ③ Mirror exactly what the preview renders. Build the nested JSX string for the
//    tree, emitting feature props only when they differ from the defaults.
const pad = (n: number) => "  ".repeat(n);

function codeForNode(node: TreeViewElement, level: number, s: State): string {
  const depth = level + 1; // Tree children start at one indent.
  const hasDuration = s.showDurations && node.duration;

  if (!isFolder(node)) {
    const attrs = [`value="${node.id}"`, `status="${node.status}"`];
    if (hasDuration) attrs.push(`duration="${node.duration}"`);
    attrs.push(`level={${level}}`);
    return [
      `${pad(depth)}<File ${attrs.join(" ")}>`,
      `${pad(depth + 1)}${node.name}`,
      `${pad(depth)}</File>`,
    ].join("\n");
  }

  const attrs = [
    `element="${node.name}"`,
    `value="${node.id}"`,
    `status="${node.status}"`,
  ];
  if (hasDuration) attrs.push(`duration="${node.duration}"`);
  if (s.nonSelectable) attrs.push("isSelectable={false}");
  attrs.push(`level={${level}}`);
  const children = (node.children ?? [])
    .map((c) => codeForNode(c, level + 1, s))
    .join("\n");
  return [
    `${pad(depth)}<Folder`,
    attrs.map((a) => `${pad(depth + 1)}${a}`).join("\n"),
    `${pad(depth)}>`,
    children,
    `${pad(depth)}</Folder>`,
  ].join("\n");
}

// Serialize the sample tree to a JS literal. The Tree needs this `elements` array
// to auto-expand the path to initialSelectedId (and CollapseButton uses it too).
function serializeNode(
  node: TreeViewElement,
  depth: number,
  s: State,
): string {
  const folder = isFolder(node);
  const lines = [
    `${pad(depth)}{`,
    `${pad(depth + 1)}id: "${node.id}",`,
    `${pad(depth + 1)}name: "${node.name}",`,
    `${pad(depth + 1)}status: "${node.status}",`,
  ];
  if (node.duration)
    lines.push(`${pad(depth + 1)}duration: "${node.duration}",`);
  if (s.nonSelectable && folder)
    lines.push(`${pad(depth + 1)}isSelectable: false,`);
  if (node.children?.length) {
    lines.push(`${pad(depth + 1)}children: [`);
    lines.push(
      node.children.map((c) => serializeNode(c, depth + 2, s)).join(",\n"),
    );
    lines.push(`${pad(depth + 1)}],`);
  }
  lines.push(`${pad(depth)}}`);
  return lines.join("\n");
}

function generateCode(s: State): string {
  const elementsConst = `const treeElements = [
${SAMPLE_TREE.map((n) => serializeNode(n, 1, s)).join(",\n")}
]

`;

  // `elements` is what lets the Tree auto-expand the path to initialSelectedId,
  // so it's always passed.
  const treeAttrs = [
    `initialSelectedId="${s.selectedId}"`,
    `initialExpendedItems={${JSON.stringify(INITIAL_EXPANDED)}}`,
    "elements={treeElements}",
  ];
  if (!s.indicator) treeAttrs.push("indicator={false}");
  if (s.dir === "rtl") treeAttrs.push(`dir="rtl"`);
  treeAttrs.push(`className="h-80 w-full rounded-cn-3 border"`);

  const body = SAMPLE_TREE.map((n) => codeForNode(n, 0, s)).join("\n");

  const collapse = s.collapseButton
    ? `\n  <CollapseButton elements={treeElements}>\n    <IconV2 name="fold" size="xs" />\n  </CollapseButton>`
    : "";

  return `${elementsConst}<Tree
${treeAttrs.map((a) => `  ${a}`).join("\n")}
>
${body}${collapse}
</Tree>`;
}

const TreeViewPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ The curated control set — the Tree-level props. The tree is always
  //    interactive (expand/collapse folders, click a row to select it).
  const controls: PropControl[] = [
    {
      name: "selectedId",
      type: "select",
      options: FILE_IDS,
      description: "Row selected on mount (ancestors auto-expand)",
    },
    {
      name: "dir",
      type: "select",
      options: ["ltr", "rtl"],
      description: "Text direction of the tree",
    },
    {
      name: "indicator",
      type: "boolean",
      description: "Show the vertical hierarchy indicator lines",
    },
    {
      name: "showDurations",
      type: "boolean",
      description: "Show the duration on the right of each row",
    },
    {
      name: "nonSelectable",
      type: "boolean",
      description: "Mark the structural folders as non-selectable",
    },
    {
      name: "collapseButton",
      type: "boolean",
      description: "Add an expand/collapse-all control",
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

  // ⑤ Render the real tree from state, mirroring generateCode exactly.
  const renderNodes = (nodes: TreeViewElement[], level: number): ReactNode =>
    nodes.map((node) =>
      isFolder(node) ? (
        <Folder
          key={node.id}
          element={node.name}
          value={node.id}
          status={node.status}
          duration={state.showDurations ? node.duration : undefined}
          isSelectable={state.nonSelectable ? false : undefined}
          level={level}
        >
          {renderNodes(node.children ?? [], level + 1)}
        </Folder>
      ) : (
        <File
          key={node.id}
          value={node.id}
          status={node.status}
          duration={state.showDurations ? node.duration : undefined}
          level={level}
        >
          {node.name}
        </File>
      ),
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

          <div className="w-[520px] max-w-full">
            <Tree
              // Remount on selection change so the auto-expand reveals *only*
              // the newly-selected row's path (expandSpecificTargetedElements
              // only ever adds, never collapses). Playground-only — kept out of
              // the generated snippet.
              key={state.selectedId}
              initialSelectedId={state.selectedId}
              initialExpendedItems={INITIAL_EXPANDED}
              indicator={state.indicator}
              dir={state.dir}
              elements={SAMPLE_TREE}
              className="h-80 w-full rounded-cn-3 border"
            >
              {renderNodes(SAMPLE_TREE, 0)}
              {state.collapseButton && (
                <CollapseButton elements={SAMPLE_TREE}>
                  <IconV2 name="fold" size="xs" />
                </CollapseButton>
              )}
            </Tree>
          </div>
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

export default TreeViewPlayground;
