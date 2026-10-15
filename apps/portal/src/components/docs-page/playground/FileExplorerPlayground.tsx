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
// playground: the `structure` select swaps between a flat (basic) and a deeply nested
// tree, both of which stay fully interactive (expand/collapse folders, click a file to
// make it active), and the remaining props are exposed as controls. The "Full project
// structure" and "Custom content" examples stay on the page — they don't map to a
// single tree + controls.

// ① The sample trees, shared by BOTH the preview and the generated snippet. `tip`/`href`
//    are only applied when the tooltips/links toggles are on.
type FileNode = { type: "file"; id: string; label: string; tip: string; href: string };
type FolderNode = { type: "folder"; id: string; label: string; children: TreeNode[] };
type TreeNode = FileNode | FolderNode;

const BASIC_TREE: TreeNode[] = [
  {
    type: "folder",
    id: "public",
    label: "public",
    children: [
      { type: "file", id: "index-html", label: "index.html", tip: "Page markup", href: "#index-html" },
      { type: "file", id: "styles-css", label: "styles.css", tip: "Global styles", href: "#styles-css" },
      { type: "file", id: "script-js", label: "script.js", tip: "Entry script", href: "#script-js" },
    ],
  },
];

const NESTED_TREE: TreeNode[] = [
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

// Each structure carries its own default expand state, active-folder target,
// starting active file, and the one file whose action slot shows a button
// instead of an icon — so switching cleanly reseeds the interactive state.
interface Structure {
  value: string;
  tree: TreeNode[];
  defaultExpanded: string[];
  activeFolderId: string;
  initialActive: string;
  buttonActionId: string;
}

const STRUCTURES: Structure[] = [
  {
    value: "basic",
    tree: BASIC_TREE,
    defaultExpanded: ["public"],
    activeFolderId: "public",
    initialActive: "index-html",
    buttonActionId: "styles-css",
  },
  {
    value: "nested",
    tree: NESTED_TREE,
    defaultExpanded: ["src", "components"],
    activeFolderId: "components",
    initialActive: "button-tsx",
    buttonActionId: "input-tsx",
  },
];

const getStructure = (value: string): Structure =>
  STRUCTURES.find((s) => s.value === value) ?? STRUCTURES[0];

const DEFAULT_FOLDER_ICON = "folder";
const DEFAULT_FILE_ICON = "empty-page";

// Action buttons rendered at the end of each file row when the toggle is on.
// Each entry is Button props spread over a ghost icon button, so the slot takes
// any Button — not only an icon.
const FILE_ACTIONS = [
  { iconName: "edit-pencil" as const, title: "Edit", onClick: () => {} },
  { iconName: "trash" as const, title: "Delete", onClick: () => {} },
];

// One row (per structure, `buttonActionId`) swaps the edit icon for a labeled,
// outlined button — showing you can drop a different child element in the slot.
// A non-micro `size` is needed so the Button keeps its text label (the 2xs/3xs
// micro sizes render icon-only and strip text children).
const FILE_ACTIONS_WITH_BUTTON = [
  { variant: "outline" as const, size: "xs" as const, iconOnly: false, title: "Review", onClick: () => {} },
  { iconName: "trash" as const, title: "Delete", onClick: () => {} },
];

// ② State — one field per control. `structure` picks the tree; the rest map to props.
interface State {
  structure: string;
  folderIcon: string;
  fileIcon: string;
  tooltips: boolean;
  links: boolean;
  actionButtons: boolean;
  activeFolder: boolean;
  hideIcon: boolean;
}

const INITIAL_STATE: State = {
  structure: "nested",
  folderIcon: DEFAULT_FOLDER_ICON,
  fileIcon: DEFAULT_FILE_ICON,
  tooltips: false,
  links: false,
  actionButtons: false,
  activeFolder: false,
  hideIcon: false,
};

// ③ Mirror exactly what the preview renders. Build the nested JSX string for the
//    configured tree, emitting feature props only when their toggle is on and icon
//    props only when they differ from the component defaults.
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
    if (s.fileIcon !== DEFAULT_FILE_ICON) attrs.push(`icon="${s.fileIcon}"`);
    if (s.hideIcon) attrs.push("hideIcon");
    if (s.actionButtons)
      attrs.push(
        node.id === getStructure(s.structure).buttonActionId
          ? "actionButtons={fileActionsWithButton}"
          : "actionButtons={fileActions}"
      );
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
  if (s.folderIcon !== DEFAULT_FOLDER_ICON) attrs.push(`icon="${s.folderIcon}"`);
  if (s.hideIcon) attrs.push("hideIcon");
  if (s.activeFolder && node.id === getStructure(s.structure).activeFolderId)
    attrs.push("isActive");
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

// Any Button works in the action slot — here an outlined, labeled button
// replaces the edit icon (a non-micro size keeps the text label).
const fileActionsWithButton = [
  { variant: 'outline', size: 'xs', iconOnly: false, title: 'Review', onClick: () => {} },
  { iconName: 'trash', title: 'Delete', onClick: () => {} },
]

`
    : "";
  const body = getStructure(s.structure)
    .tree.map((n) => codeForNode(n, 0, 1, s))
    .join("\n");
  return `${actionsConst}<FileExplorer.Root value={expanded} onValueChange={setExpanded}>
${body}
</FileExplorer.Root>`;
}

const FileExplorerPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const initialStructure = getStructure(INITIAL_STATE.structure);
  const [expanded, setExpanded] = useState<string[]>(initialStructure.defaultExpanded);
  const [activeFile, setActiveFile] = useState<string>(initialStructure.initialActive);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  // Switching structure swaps the tree and reseeds the interactive state so the new
  // tree opens at its own sensible defaults.
  const selectStructure = (value: string) => {
    const next = getStructure(value);
    setState((prev) => ({ ...prev, structure: value }));
    setExpanded(next.defaultExpanded);
    setActiveFile(next.initialActive);
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setExpanded(initialStructure.defaultExpanded);
    setActiveFile(initialStructure.initialActive);
  };

  // ④ The curated control set — the structure switch plus the FileExplorer props. The
  //    tree is always interactive (expand/collapse, click to select the active file).
  const controls: PropControl[] = [
    {
      name: "structure",
      type: "select",
      options: STRUCTURES.map((s) => s.value),
      description: "Flat (basic) vs. deeply nested tree",
    },
    {
      name: "folderIcon",
      type: "select",
      options: ["folder", "folder-solid", "folder-opened", "folder-settings"],
      description: "Icon shown on folder rows",
    },
    {
      name: "fileIcon",
      type: "select",
      options: ["empty-page", "code-brackets", "submit-document"],
      description: "Icon shown on file rows",
    },
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
      description: "Highlight the active folder with isActive",
    },
    {
      name: "hideIcon",
      type: "boolean",
      description: "Hide the icon on every row",
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
        prop.name === "structure"
          ? selectStructure(v as string)
          : set(prop.name as keyof State, v as never)
      }
    />
  );

  // ⑤ Render the real tree from state, mirroring generateCode exactly.
  const structure = getStructure(state.structure);

  const renderNodes = (nodes: TreeNode[], level: number): ReactNode =>
    nodes.map((node) =>
      node.type === "file" ? (
        <FileExplorer.FileItem
          key={node.id}
          level={level}
          value={node.id}
          isActive={activeFile === node.id}
          onClick={setActiveFile}
          icon={state.fileIcon as never}
          hideIcon={state.hideIcon}
          link={state.links ? node.href : undefined}
          tooltip={state.tooltips ? node.tip : undefined}
          actionButtons={
            state.actionButtons
              ? node.id === structure.buttonActionId
                ? FILE_ACTIONS_WITH_BUTTON
                : FILE_ACTIONS
              : undefined
          }
        >
          {node.label}
        </FileExplorer.FileItem>
      ) : (
        <FileExplorer.FolderItem
          key={node.id}
          value={node.id}
          level={level}
          icon={state.folderIcon as never}
          hideIcon={state.hideIcon}
          link={state.links ? `#${node.id}` : undefined}
          isActive={state.activeFolder && node.id === structure.activeFolderId}
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

          <div className="bg-cn-1 w-[480px] max-w-full rounded-cn-2 border p-cn-xs">
            <FileExplorer.Root value={expanded} onValueChange={setExpanded}>
              {renderNodes(structure.tree, 0)}
            </FileExplorer.Root>
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

export default FileExplorerPlayground;
