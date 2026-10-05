import { type FC, Fragment, useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Breadcrumb is a compositional component, so the trail itself is fixed; the
// controls toggle the structural pieces (icons, interactive root, ellipsis
// collapse, copy button) that you'd otherwise have to hand-assemble.

// The canonical trail. The two middle steps are what the Ellipsis collapses;
// everything else stays visible either way.
const ROOT_LABEL = "Harness";
const HIDDEN_ITEMS = [
  { label: "Project", href: "#" },
  { label: "Pipelines", href: "#" },
];
const PARENT_LABEL = "Builds";
const PAGE_LABEL = "Settings";
const COPY_PATH = "Harness/Project/Pipelines/Builds/Settings";

// ② The state shape — one field per control.
interface State {
  size: "sm" | "xs";
  prefixIcons: boolean;
  interactiveRoot: boolean;
  ellipsis: boolean;
  copy: boolean;
}

// ② Defaults, hoisted so the reset button can reuse them. Opens on a plain,
//    fully-expanded trail with folder icons — the most familiar shape.
const INITIAL_STATE: State = {
  size: "sm",
  prefixIcons: true,
  interactiveRoot: false,
  ellipsis: false,
  copy: false,
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Mirrors exactly what the preview renders.
function generateCode(s: State): string {
  const rootSize = s.size !== "sm" ? ` size="${s.size}"` : ""; // default is sm
  const icon = s.prefixIcons ? ' prefixIcon="folder"' : "";
  const lines: string[] = [];

  lines.push(`<Breadcrumb.Root${rootSize}>`);
  lines.push(`  <Breadcrumb.List>`);

  // Root step — either an interactive avatar button or a plain link.
  lines.push(`    <Breadcrumb.Item>`);
  if (s.interactiveRoot) {
    lines.push(
      `      <Breadcrumb.RootInteractive${rootSize}>${ROOT_LABEL}</Breadcrumb.RootInteractive>`
    );
  } else {
    lines.push(`      <Breadcrumb.Link href="#">${ROOT_LABEL}</Breadcrumb.Link>`);
  }
  lines.push(`    </Breadcrumb.Item>`);
  lines.push(`    <Breadcrumb.Separator />`);

  // Middle steps — collapsed behind an Ellipsis, or rendered inline.
  if (s.ellipsis) {
    lines.push(`    <Breadcrumb.Ellipsis`);
    lines.push(`      aria-label="Show hidden breadcrumbs"`);
    lines.push(`      items={[`);
    HIDDEN_ITEMS.forEach((i) =>
      lines.push(`        { label: "${i.label}", href: "#" },`)
    );
    lines.push(`      ]}`);
    lines.push(`    />`);
    lines.push(`    <Breadcrumb.Separator />`);
  } else {
    HIDDEN_ITEMS.forEach((i) => {
      lines.push(`    <Breadcrumb.Item>`);
      lines.push(`      <Breadcrumb.Link href="#"${icon}>${i.label}</Breadcrumb.Link>`);
      lines.push(`    </Breadcrumb.Item>`);
      lines.push(`    <Breadcrumb.Separator />`);
    });
  }

  // Parent step and the current page.
  lines.push(`    <Breadcrumb.Item>`);
  lines.push(`      <Breadcrumb.Link href="#"${icon}>${PARENT_LABEL}</Breadcrumb.Link>`);
  lines.push(`    </Breadcrumb.Item>`);
  lines.push(`    <Breadcrumb.Separator />`);
  lines.push(`    <Breadcrumb.Page>${PAGE_LABEL}</Breadcrumb.Page>`);
  lines.push(`  </Breadcrumb.List>`);

  if (s.copy) lines.push(`  <Breadcrumb.Copy name="${COPY_PATH}" />`);
  lines.push(`</Breadcrumb.Root>`);

  return lines.join("\n");
}

const BreadcrumbPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "size",
      type: "select",
      options: ["sm", "xs"],
      description: "Scales the whole breadcrumb (xs suits dense headers)",
    },
    {
      name: "prefixIcons",
      type: "boolean",
      description: "Show a folder icon before each link",
    },
    {
      name: "interactiveRoot",
      type: "boolean",
      description: "Use RootInteractive (avatar + chevron) as the first step",
    },
    {
      name: "ellipsis",
      type: "boolean",
      description: "Collapse the middle steps into an Ellipsis dropdown",
    },
    {
      name: "copy",
      type: "boolean",
      description: "Show a button that copies the full path",
    },
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the text/select controls.
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

  // ⑤ Render the real component from state, mirroring generateCode exactly.
  const iconProp = state.prefixIcons
    ? ({ prefixIcon: "folder" } as const)
    : {};
  const preview = (
    <Breadcrumb.Root size={state.size}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          {state.interactiveRoot ? (
            <Breadcrumb.RootInteractive size={state.size}>
              {ROOT_LABEL}
            </Breadcrumb.RootInteractive>
          ) : (
            <Breadcrumb.Link href="#">{ROOT_LABEL}</Breadcrumb.Link>
          )}
        </Breadcrumb.Item>
        <Breadcrumb.Separator />

        {state.ellipsis ? (
          <>
            <Breadcrumb.Ellipsis
              aria-label="Show hidden breadcrumbs"
              items={HIDDEN_ITEMS}
            />
            <Breadcrumb.Separator />
          </>
        ) : (
          HIDDEN_ITEMS.map((item) => (
            <Fragment key={item.label}>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#" {...iconProp}>
                  {item.label}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
            </Fragment>
          ))
        )}

        <Breadcrumb.Item>
          <Breadcrumb.Link href="#" {...iconProp}>
            {PARENT_LABEL}
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Page>{PAGE_LABEL}</Breadcrumb.Page>
      </Breadcrumb.List>
      {state.copy && <Breadcrumb.Copy name={COPY_PATH} />}
    </Breadcrumb.Root>
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

export default BreadcrumbPlayground;
