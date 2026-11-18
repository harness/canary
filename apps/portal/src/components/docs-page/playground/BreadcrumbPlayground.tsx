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

// The canonical trail: Account > Organization > Project > page. The Ellipsis
// collapses Account and Organization; the Project and the page stay visible.
const HIDDEN_ITEMS = [
  { label: "Account ID", href: "#", icon: "globe" },
  { label: "Organization", href: "#", icon: "organizations" },
] as const;
const PROJECT_LABEL = "Project";
const PAGE_LABEL = "Settings";
const COPY_PATH = "Account ID/Organization/Project/Settings";

// ② The state shape — one field per control.
interface State {
  size: "sm" | "xs";
  prefixIcons: boolean;
  interactiveRoot: boolean;
  ellipsis: boolean;
  expandInline: boolean;
  showTooltip: boolean;
  copy: boolean;
}

// ② Defaults, hoisted so the reset button can reuse them. Opens on a plain,
//    fully-expanded trail with folder icons — the most familiar shape.
const INITIAL_STATE: State = {
  size: "sm",
  prefixIcons: true,
  interactiveRoot: false,
  ellipsis: false,
  expandInline: false,
  showTooltip: false,
  copy: false,
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Mirrors exactly what the preview renders.
function generateCode(s: State): string {
  const rootSize = s.size !== "sm" ? ` size="${s.size}"` : ""; // default is sm
  const lines: string[] = [];

  lines.push(`<Breadcrumb.Root${rootSize}>`);
  lines.push(`  <Breadcrumb.List>`);

  // Account and Organization — collapsed behind an Ellipsis, or inline. When
  // inline, the interactive root swaps the first step (Account ID).
  if (s.ellipsis) {
    lines.push(`    <Breadcrumb.Ellipsis`);
    lines.push(`      aria-label="Show hidden breadcrumbs"`);
    if (s.expandInline) lines.push(`      expandInline`);
    if (s.showTooltip) lines.push(`      showTooltip`);
    lines.push(`      items={[`);
    HIDDEN_ITEMS.forEach((i) =>
      lines.push(
        `        { label: "${i.label}", href: "#", icon: "${i.icon}" },`,
      ),
    );
    lines.push(`      ]}`);
    lines.push(`    />`);
    lines.push(`    <Breadcrumb.Separator />`);
  } else {
    HIDDEN_ITEMS.forEach((i, idx) => {
      lines.push(`    <Breadcrumb.Item>`);
      if (idx === 0 && s.interactiveRoot) {
        lines.push(
          `      <Breadcrumb.RootInteractive${rootSize} variant="plain">${i.label}</Breadcrumb.RootInteractive>`,
        );
      } else {
        lines.push(
          `      <Breadcrumb.Link href="#"${s.prefixIcons ? ` prefixIcon="${i.icon}"` : ""}>${i.label}</Breadcrumb.Link>`,
        );
      }
      lines.push(`    </Breadcrumb.Item>`);
      lines.push(`    <Breadcrumb.Separator />`);
    });
  }

  // Project step.
  lines.push(`    <Breadcrumb.Item>`);
  lines.push(
    `      <Breadcrumb.Link href="#"${s.prefixIcons ? ' prefixIcon="folder"' : ""}>${PROJECT_LABEL}</Breadcrumb.Link>`,
  );
  lines.push(`    </Breadcrumb.Item>`);
  lines.push(`    <Breadcrumb.Separator />`);

  // The current page.
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
      description: "Show an icon before each link",
    },
    {
      name: "interactiveRoot",
      type: "boolean",
      description:
        "Use RootInteractive (icon + chevron) as the first step (needs ellipsis off)",
    },
    {
      name: "ellipsis",
      type: "boolean",
      description: "Collapse the middle steps into an Ellipsis dropdown",
    },
    {
      name: "expandInline",
      type: "boolean",
      description:
        "Expand hidden steps in place instead of a dropdown (needs ellipsis)",
    },
    {
      name: "showTooltip",
      type: "boolean",
      description: "Label the Ellipsis button with a tooltip (needs ellipsis)",
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
  const preview = (
    <Breadcrumb.Root size={state.size}>
      <Breadcrumb.List>
        {state.ellipsis ? (
          <>
            <Breadcrumb.Ellipsis
              aria-label="Show hidden breadcrumbs"
              expandInline={state.expandInline}
              showTooltip={state.showTooltip}
              items={[...HIDDEN_ITEMS]}
            />
            <Breadcrumb.Separator />
          </>
        ) : (
          HIDDEN_ITEMS.map((item, idx) => (
            <Fragment key={item.label}>
              <Breadcrumb.Item>
                {idx === 0 && state.interactiveRoot ? (
                  <Breadcrumb.RootInteractive size={state.size} variant="plain">
                    {item.label}
                  </Breadcrumb.RootInteractive>
                ) : (
                  <Breadcrumb.Link
                    href="#"
                    {...(state.prefixIcons ? { prefixIcon: item.icon } : {})}
                  >
                    {item.label}
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
            </Fragment>
          ))
        )}

        <Breadcrumb.Item>
          <Breadcrumb.Link
            href="#"
            {...(state.prefixIcons ? { prefixIcon: "folder" } : {})}
          >
            {PROJECT_LABEL}
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
