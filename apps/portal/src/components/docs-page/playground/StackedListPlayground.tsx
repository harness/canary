import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  StackedList,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// StackedList is a compound component — Root wraps Header + Items, each Item
// holds Fields. A single scalar control can't express that structure, so this
// is a bespoke playground: the preview renders a real, multi-row list and the
// controls shape the whole composition (the Root frame, how every Item looks,
// and what each Field shows). Controls apply uniformly across the rows so the
// list reads as a consistent column of information.

// A small, realistic data set the list maps over — like a connectors or
// resources table. Icons reuse names already used in the docs examples.
const ITEMS = [
  {
    icon: "connectors",
    title: "Kubernetes cluster",
    description: "Last synced 2 minutes ago",
    meta: "Active",
  },
  {
    icon: "star",
    title: "Production database",
    description: "Last synced 5 minutes ago",
    meta: "Active",
  },
  {
    icon: "check",
    title: "Artifact registry",
    description: "Last synced 12 minutes ago",
    meta: "Active",
  },
];

const SPACING_OPTIONS = [
  "4xs",
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "0",
];
const TITLE_COLOR_OPTIONS = [
  "foreground-1",
  "foreground-2",
  "foreground-3",
  "success",
  "warning",
  "danger",
  "brand",
  "merged",
];
const CLICKABLE_OPTIONS = ["none", "link", "button"];
const ROUNDED_OPTIONS = ["default", "top"];

// ① The state shape — grouped by which part of the compound it drives.
interface State {
  // Root
  border: boolean;
  rounded: string;
  pagination: boolean;
  // Item
  thumbnail: boolean;
  actions: boolean;
  clickable: string;
  disableHover: boolean;
  paddingX: string;
  paddingY: string;
  // Field
  header: boolean;
  titleColor: string;
  rightField: boolean;
  disableTruncate: boolean;
}

const INITIAL_STATE: State = {
  border: true,
  rounded: "default",
  pagination: false,
  thumbnail: true,
  actions: true,
  clickable: "button",
  disableHover: false,
  paddingX: "md",
  paddingY: "md",
  header: true,
  titleColor: "foreground-1",
  rightField: true,
  disableTruncate: false,
};

const PAGINATION_SNIPPET =
  "paginationProps={{ pageSize: 10, totalItems: 50, currentPage: 1, goToPage: (page) => console.log(page) }}";

// ② Build the compound JSX string shown in "Show code". The list maps over an
//    `items` array (how it'd really be used), so item/field props are emitted
//    once inside the map. Only non-default props appear.
function generateCode(s: State): string {
  const root: string[] = [];
  if (!s.border) root.push(" border={false}");
  if (s.rounded === "top") root.push(' rounded="top"');
  if (s.pagination) root.push(` ${PAGINATION_SNIPPET}`);

  const lines: string[] = [`<StackedList.Root${root.join("")}>`];

  if (s.header) {
    lines.push("  <StackedList.Header>");
    lines.push('    <StackedList.Field title="Name" />');
    if (s.rightField)
      lines.push('    <StackedList.Field title="Status" right />');
    lines.push("  </StackedList.Header>");
  }

  const itemProps: string[] = [];
  if (s.thumbnail)
    itemProps.push('      thumbnail={<IconV2 name={item.icon} size="xs" />}');
  if (s.actions)
    itemProps.push('      actions={<Button variant="outline">Manage</Button>}');
  if (s.clickable === "link") itemProps.push('      to="/"');
  else if (s.clickable === "button")
    itemProps.push("      onClick={() => console.log(item.title)}");
  if (s.disableHover) itemProps.push("      disableHover");
  if (s.paddingX !== "md") itemProps.push(`      paddingX="${s.paddingX}"`);
  if (s.paddingY !== "md") itemProps.push(`      paddingY="${s.paddingY}"`);

  const fieldAttrs: string[] = [];
  if (s.titleColor !== "foreground-1")
    fieldAttrs.push(` titleColor="${s.titleColor}"`);
  if (s.disableTruncate) fieldAttrs.push(" disableTruncate");

  lines.push("  {items.map((item) => (");
  if (itemProps.length === 0) {
    lines.push("    <StackedList.Item key={item.title}>");
  } else {
    lines.push("    <StackedList.Item");
    lines.push("      key={item.title}");
    itemProps.forEach((l) => lines.push(l));
    lines.push("    >");
  }
  lines.push(
    `      <StackedList.Field title={item.title} description={item.description}${fieldAttrs.join(
      "",
    )} />`,
  );
  if (s.rightField)
    lines.push("      <StackedList.Field title={item.meta} right />");
  lines.push("    </StackedList.Item>");
  lines.push("  ))}");
  lines.push("</StackedList.Root>");
  return lines.join("\n");
}

const StackedListPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, val: State[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const reset = () => setState(INITIAL_STATE);

  // ③ The curated control set, grouped Root → Item → Field.
  const controls: PropControl[] = [
    {
      name: "rounded",
      type: "select",
      options: ROUNDED_OPTIONS,
      description: "Root: corner rounding",
    },
    {
      name: "clickable",
      type: "select",
      options: CLICKABLE_OPTIONS,
      description: "Item: link, button, or static",
    },
    {
      name: "paddingX",
      type: "select",
      options: SPACING_OPTIONS,
      description: "Item: horizontal padding",
    },
    {
      name: "paddingY",
      type: "select",
      options: SPACING_OPTIONS,
      description: "Item: vertical padding",
    },
    {
      name: "titleColor",
      type: "select",
      options: TITLE_COLOR_OPTIONS,
      description: "Field: title color",
    },
    {
      name: "border",
      type: "boolean",
      description: "Root: show the border",
    },
    {
      name: "pagination",
      type: "boolean",
      description: "Root: show pagination footer",
    },
    {
      name: "thumbnail",
      type: "boolean",
      description: "Item: leading icon",
    },
    {
      name: "actions",
      type: "boolean",
      description: "Item: trailing action button",
    },
    {
      name: "disableHover",
      type: "boolean",
      description: "Item: turn off hover effect",
    },
    {
      name: "header",
      type: "boolean",
      description: "Show the header row",
    },
    {
      name: "rightField",
      type: "boolean",
      description: "Field: trailing right-aligned field",
    },
    {
      name: "disableTruncate",
      type: "boolean",
      description: "Field: disable title/description truncation",
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

  // ④ Render the real compound from state. In the preview, "link" items
  //    preventDefault so clicking a row doesn't navigate the doc site away;
  //    the generated code shows the idiomatic `to="/"`.
  const clickProps =
    state.clickable === "link"
      ? { to: "/", linkProps: { onClick: (e: React.MouseEvent) => e.preventDefault() } }
      : state.clickable === "button"
        ? { onClick: () => {} }
        : {};

  const preview = (
    <div className="w-full max-w-[520px]">
      <StackedList.Root
        border={state.border ? undefined : false}
        rounded={state.rounded === "top" ? "top" : undefined}
        paginationProps={
          state.pagination
            ? {
                pageSize: 10,
                totalItems: 50,
                currentPage: 1,
                goToPage: () => {},
                pageSizeOptions: [5, 10, 20],
                onPageSizeChange: () => {},
              }
            : undefined
        }
      >
        {state.header && (
          <StackedList.Header>
            <StackedList.Field title="Name" />
            {state.rightField && (
              <StackedList.Field title="Status" right />
            )}
          </StackedList.Header>
        )}
        {ITEMS.map((item) => (
          <StackedList.Item
            key={item.title}
            thumbnail={
              state.thumbnail ? (
                <IconV2 name={item.icon as never} size="xs" />
              ) : undefined
            }
            actions={
              state.actions ? (
                <Button variant="outline">Manage</Button>
              ) : undefined
            }
            disableHover={state.disableHover}
            paddingX={state.paddingX as never}
            paddingY={state.paddingY as never}
            {...clickProps}
          >
            <StackedList.Field
              title={item.title}
              description={item.description}
              titleColor={state.titleColor as never}
              disableTruncate={state.disableTruncate}
            />
            {state.rightField && (
              <StackedList.Field title={item.meta} right />
            )}
          </StackedList.Item>
        ))}
      </StackedList.Root>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live list; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[260px] items-center justify-center p-cn-3xl">
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

export default StackedListPlayground;
