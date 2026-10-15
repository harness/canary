import { type FC, type ReactNode, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  FileExplorer,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// FileExplorer is a compositional compound component (Root > FolderItem / FileItem),
// not a prop-driven one — you build a tree by nesting parts. So this is a bespoke
// playground: it renders one representative project tree that stays fully interactive
// (expand/collapse folders, click a file to make it active) and layers the documented
// features on via toggles. The "Full project structure" and "Custom content" examples
// are intentionally left on the page instead — they don't map to a single tree + toggles.

// ① The sample tree, shared by BOTH the preview and the generated snippet. `tip`/`href`
//    are only applied when the tooltips/links toggles are on.
type FileNode = { type: "file"; id: string; label: string; tip: string; href: string };
type FolderNode = { type: "folder"; id: string; label: string; children: TreeNode[] };
type TreeNode = FileNode | FolderNode;

const TREE: TreeNode[] = [
  {
    type: "folder",
    id: "src",
    label: "src",
    children: [
      {
        type: "folder",
        id: "components",
        label: "components",
        children: [
          { type: "file", id: "button-tsx", label: "Button.tsx", tip: "Reusable button component", href: "#button-tsx" },
          { type: "file", id: "input-tsx", label: "Input.tsx", tip: "Form input component", href: "#input-tsx" },
          { type: "file", id: "modal-tsx", label: "Modal.tsx", tip: "Modal dialog component", href: "#modal-tsx" },
        ],
      },
      {
        type: "folder",
        id: "utils",
        label: "utils",
        children: [
          { type: "file", id: "helpers-ts", label: "helpers.ts", tip: "Helper functions", href: "#helpers-ts" },
          { type: "file", id: "constants-ts", label: "constants.ts", tip: "Shared constants", href: "#constants-ts" },
        ],
      },
      { type: "file", id: "index-ts", label: "index.ts", tip: "Entry point", href: "#index-ts" },
    ],
  },
];

const DEFAULT_EXPANDED = ["src", "components"];
const ACTIVE_FOLDER_ID = "components";

// Action buttons rendered at the end of each file row when the toggle is on.
const FILE_ACTIONS = [
  { iconName: "edit-pencil" as const, title: "Edit", onClick: () => {} },
  { iconName: "trash" as const, title: "Delete", onClick: () => {} },
];

// ② State — one field per toggle. The tree's expand state and active file are
//    separate live state so the preview stays interactive.
interface State {
  links: boolean;
  tooltips: boolean;
  actionButtons: boolean;
  activeFolder: boolean;
}

const INITIAL_STATE: State = {
  links: false,
  tooltips: true,
  actionButtons: false,
  activeFolder: false,
};

const INITIAL_ACTIVE = "button-tsx";

// ③ Mirror exactly what the preview renders. Build the nested JSX string for the
//    configured tree, emitting feature props only when their toggle is on.
const pad = (n: number) => "  ".repeat(n);

function codeForNode(node: TreeNode, level: number, depth: number, s: State): string {
  if (node.type === "file") {
    const attrs = [
      `level={${level}}`,
      `value="${node.id}"`,
      `isActive={activeFile === '${node.id}'}`,
      "onClick={setActiveFile}",
    ];
    if (s.links) attrs.push(`link="${node.href}"`);
    if (s.tooltips) attrs.push(`tooltip="${node.tip}"`);
    if (s.actionButtons) attrs.push("actionButtons={fileActions}");
    return [
      `${pad(depth)}<FileExplorer.FileItem`,
      attrs.map((a) => `${pad(depth + 1)}${a}`).join("\n"),
      `${pad(depth)}>`,
      `${pad(depth + 1)}${node.label}`,
      `${pad(depth)}</FileExplorer.FileItem>`,
    ].join("\n");
  }

  const attrs = [`value="${node.id}"`, `level={${level}}`];
  if (s.links) attrs.push(`link="#${node.id}"`);
  if (s.activeFolder && node.id === ACTIVE_FOLDER_ID) attrs.push("isActive");
  const children = node.children
    .map((c) => codeForNode(c, level + 1, depth + 3, s))
    .join("\n");
  return [
    `${pad(depth)}<FileExplorer.FolderItem`,
    attrs.map((a) => `${pad(depth + 1)}${a}`).join("\n"),
    `${pad(depth + 1)}content={`,
    `${pad(depth + 2)}<FileExplorer.Root value={expanded} onValueChange={setExpanded}>`,
    children,
    `${pad(depth + 2)}</FileExplorer.Root>`,
    `${pad(depth + 1)}}`,
    `${pad(depth)}>`,
    `${pad(depth + 1)}${node.label}`,
    `${pad(depth)}</FileExplorer.FolderItem>`,
  ].join("\n");
}

function generateCode(s: State): string {
  const actionsConst = s.actionButtons
    ? `const fileActions = [
  { iconName: 'edit-pencil', title: 'Edit', onClick: () => {} },
  { iconName: 'trash', title: 'Delete', onClick: () => {} },
]

`
    : "";
  const body = TREE.map((n) => codeForNode(n, 0, 1, s)).join("\n");
  return `${actionsConst}<FileExplorer.Root value={expanded} onValueChange={setExpanded}>
${body}
</FileExplorer.Root>`;
}

const FileExplorerPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [expanded, setExpanded] = useState<string[]>(DEFAULT_EXPANDED);
  const [activeFile, setActiveFile] = useState<string>(INITIAL_ACTIVE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setExpanded(DEFAULT_EXPANDED);
    setActiveFile(INITIAL_ACTIVE);
  };

  // ④ The curated control set — the documented features as toggles. The tree is
  //    always interactive (expand/collapse, click to select the active file).
  const controls: PropControl[] = [
    { name: "tooltips", type: "boolean", description: "Show a tooltip on each file" },
    {
      name: "links",
      type: "boolean",
      description: "Make files and folders navigable with the link prop",
    },
    {
      name: "actionButtons",
      type: "boolean",
      description: "Show action buttons at the end of each file row",
    },
    {
      name: "activeFolder",
      type: "boolean",
      description: "Highlight the components folder with isActive",
    },
  ];

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ⑤ Render the real tree from state, mirroring generateCode exactly.
  const renderNodes = (nodes: TreeNode[], level: number): ReactNode =>
    nodes.map((node) =>
      node.type === "file" ? (
        <FileExplorer.FileItem
          key={node.id}
          level={level}
          value={node.id}
          isActive={activeFile === node.id}
          onClick={setActiveFile}
          link={state.links ? node.href : undefined}
          tooltip={state.tooltips ? node.tip : undefined}
          actionButtons={state.actionButtons ? FILE_ACTIONS : undefined}
        >
          {node.label}
        </FileExplorer.FileItem>
      ) : (
        <FileExplorer.FolderItem
          key={node.id}
          value={node.id}
          level={level}
          link={state.links ? `#${node.id}` : undefined}
          isActive={state.activeFolder && node.id === ACTIVE_FOLDER_ID}
          content={
            <FileExplorer.Root value={expanded} onValueChange={setExpanded}>
              {renderNodes(node.children, level + 1)}
            </FileExplorer.Root>
          }
        >
          {node.label}
        </FileExplorer.FolderItem>
      )
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

          <div className="bg-cn-1 w-[320px] max-w-full rounded-cn-2 border p-cn-xs">
            <FileExplorer.Root value={expanded} onValueChange={setExpanded}>
              {renderNodes(TREE, 0)}
            </FileExplorer.Root>
          </div>
        </div>

        {/* --- Control grid: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {controls.map(renderControl)}
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

export default FileExplorerPlayground;
