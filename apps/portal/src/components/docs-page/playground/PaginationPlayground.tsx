import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Pagination,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Pagination is bespoke because it's inherently stateful — the page is driven by
// the component's own Previous / Next controls — and it has two mutually-exclusive
// modes the generic schema can't express:
//   • Determinate   — `totalItems` + `pageSize` let it compute "Page X of Y".
//   • Indeterminate — `hasNext` / `hasPrevious` for cursor-style data where the
//     total is unknown; only the Prev / Next controls render.
// The playground keeps `currentPage` in state and feeds it back through the nav
// callbacks, so clicking Prev / Next actually pages. Turning on the page-size
// select wires up `onPageSizeChange` (which the determinate math reacts to).

type Mode = "determinate" | "indeterminate";

// ② State — a superset; controls show/hide per mode. `currentPage` isn't a control,
//    it's the live page the nav buttons move through.
interface State {
  mode: Mode;
  totalItems: number;
  pageSize: number;
  showPageSize: boolean;
  currentPage: number;
}

const INITIAL_STATE: State = {
  mode: "determinate",
  totalItems: 100,
  pageSize: 10,
  showPageSize: false,
  currentPage: 1,
};

const PAGE_SIZE_OPTIONS = ["10", "25", "50"];

// ③ Mirror exactly what the preview renders — one generator per mode. The code uses
//    the realistic `currentPage` / `setCurrentPage` / `setPageSize` state handlers
//    you'd wire up in a real app.
function generateDeterminateCode(s: State): string {
  const attrs = [
    `  totalItems={${s.totalItems}}`,
    `  pageSize={${s.pageSize}}`,
    `  currentPage={currentPage}`,
    `  goToPage={setCurrentPage}`,
  ];
  if (s.showPageSize) attrs.push(`  onPageSizeChange={setPageSize}`);
  return ["<Pagination", ...attrs, "/>"].join("\n");
}

function generateIndeterminateCode(s: State): string {
  const attrs = [
    `  indeterminate`,
    `  currentPage={currentPage}`,
    `  hasPrevious={currentPage > 1}`,
    `  hasNext`,
    `  onPrevious={() => setCurrentPage(currentPage - 1)}`,
    `  onNext={() => setCurrentPage(currentPage + 1)}`,
  ];
  if (s.showPageSize) {
    attrs.push(`  pageSize={${s.pageSize}}`);
    attrs.push(`  onPageSizeChange={setPageSize}`);
  }
  return ["<Pagination", ...attrs, "/>"].join("\n");
}

const generateCode = (s: State): string =>
  s.mode === "indeterminate"
    ? generateIndeterminateCode(s)
    : generateDeterminateCode(s);

const clampPage = (page: number, totalItems: number, pageSize: number): number => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.min(Math.max(1, page), totalPages);
};

const PaginationPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const isIndeterminate = state.mode === "indeterminate";

  // Changing the page size can leave the current page past the (new) last page,
  // so clamp it in determinate mode. Shared by the control and the in-preview select.
  const handlePageSizeChange = (size: number) =>
    setState((prev) => ({
      ...prev,
      pageSize: size,
      currentPage:
        prev.mode === "indeterminate"
          ? prev.currentPage
          : clampPage(prev.currentPage, prev.totalItems, size),
    }));

  const handleControlChange = (name: keyof State, v: unknown) => {
    if (name === "mode") {
      // Reset to page 1 so the new mode starts from a clean state.
      setState((prev) => ({ ...prev, mode: v as Mode, currentPage: 1 }));
    } else if (name === "pageSize") {
      handlePageSizeChange(Number(v));
    } else if (name === "totalItems") {
      const totalItems = Number(v) || 0;
      setState((prev) => ({
        ...prev,
        totalItems,
        currentPage: clampPage(prev.currentPage, totalItems, prev.pageSize),
      }));
    } else if (name === "showPageSize") {
      set("showPageSize", Boolean(v));
    }
  };

  // ④ Curated control set — `totalItems` is determinate-only, and `pageSize` only
  //    shows when it actually does something (determinate math, or the live select).
  const controls: PropControl[] = [
    {
      name: "mode",
      type: "select",
      options: ["determinate", "indeterminate"],
      description: "Known total, or unknown (cursor-style)",
    },
    ...(!isIndeterminate
      ? ([
          {
            name: "totalItems",
            type: "number",
            required: true,
            description: "Total number of items",
          },
        ] as PropControl[])
      : []),
    ...(!isIndeterminate || state.showPageSize
      ? ([
          {
            name: "pageSize",
            type: "select",
            options: PAGE_SIZE_OPTIONS,
            required: true,
            description: "Items per page",
          },
        ] as PropControl[])
      : []),
    {
      name: "showPageSize",
      type: "boolean",
      description: "Show the items-per-page select",
    },
  ];

  const inputControls = controls.filter((c) => c.type !== "boolean");
  const booleanControls = controls.filter((c) => c.type === "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      // The select binds to a string; everything else reads straight from state.
      value={
        prop.name === "pageSize"
          ? String(state.pageSize)
          : state[prop.name as keyof State]
      }
      onChange={(v) => handleControlChange(prop.name as keyof State, v)}
    />
  );

  // ⑤ Render the real Pagination from state, mirroring generateCode exactly.
  const preview = (
    <div className="w-[550px] max-w-full">
      {isIndeterminate ? (
        <Pagination
          indeterminate
          currentPage={state.currentPage}
          hasPrevious={state.currentPage > 1}
          hasNext
          onPrevious={() =>
            set("currentPage", Math.max(1, state.currentPage - 1))
          }
          onNext={() => set("currentPage", state.currentPage + 1)}
          pageSize={state.pageSize}
          onPageSizeChange={state.showPageSize ? handlePageSizeChange : undefined}
        />
      ) : (
        <Pagination
          totalItems={state.totalItems}
          pageSize={state.pageSize}
          currentPage={state.currentPage}
          goToPage={(p) => set("currentPage", p)}
          onPageSizeChange={state.showPageSize ? handlePageSizeChange : undefined}
        />
      )}
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

export default PaginationPlayground;
