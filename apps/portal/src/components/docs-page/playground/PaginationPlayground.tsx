import {
  type ComponentPropsWithoutRef,
  type FC,
  forwardRef,
  useMemo,
  useState,
} from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Pagination,
  TooltipProvider,
} from "@harnessio/ui/components";
import { RouterContextProvider, type LinkProps } from "@harnessio/ui/context";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Pagination is bespoke because it's inherently stateful — the page is driven by
// the component's own Previous / Next controls — and it has two mutually-exclusive
// modes the generic schema can't express:
//   • Determinate   — `totalItems` + `pageSize` let it compute "Page X of Y".
//   • Indeterminate — `hasNext` / `hasPrevious` for cursor-style data where the
//     total is unknown; only the Prev / Next controls render.
// On top of that, each mode has two navigation styles: callbacks (`goToPage`, or
// `onPrevious` / `onNext`) that render <button>s, or link getters (`getPageLink`,
// or `getPrevPageLink` / `getNextPageLink`) that render anchors styled as buttons.
// The playground keeps `currentPage` in state and feeds it back through the nav
// callbacks, so clicking Prev / Next actually pages. Turning on the page-size
// select wires up `onPageSizeChange` (which the determinate math reacts to).

type Mode = "determinate" | "indeterminate";
type NavStyle = "callback" | "link";

// ② State — a superset; controls show/hide per mode. `currentPage` isn't a control,
//    it's the live page the nav buttons move through.
interface State {
  mode: Mode;
  navStyle: NavStyle;
  totalItems: number;
  pageSize: number;
  showPageSize: boolean;
  currentPage: number;
}

const INITIAL_STATE: State = {
  mode: "determinate",
  navStyle: "callback",
  totalItems: 100,
  pageSize: 10,
  showPageSize: false,
  currentPage: 1,
};

const PAGE_SIZE_OPTIONS = ["10", "25", "50"];

// ③ Mirror exactly what the preview renders — one generator per mode. The code uses
//    the realistic `currentPage` / `setCurrentPage` / `setPageSize` state handlers,
//    and the realistic link getters (`?page=N`), you'd wire up in a real app.
function generateDeterminateCode(s: State): string {
  const attrs = [
    `  totalItems={${s.totalItems}}`,
    `  pageSize={${s.pageSize}}`,
    `  currentPage={currentPage}`,
    s.navStyle === "link"
      ? "  getPageLink={(page) => `?page=${page}`}"
      : `  goToPage={setCurrentPage}`,
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
    ...(s.navStyle === "link"
      ? [
          "  getPrevPageLink={() => `?page=${currentPage - 1}`}",
          "  getNextPageLink={() => `?page=${currentPage + 1}`}",
        ]
      : [
          `  onPrevious={() => setCurrentPage(currentPage - 1)}`,
          `  onNext={() => setCurrentPage(currentPage + 1)}`,
        ]),
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

const clampPage = (
  page: number,
  totalItems: number,
  pageSize: number,
): number => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.min(Math.max(1, page), totalPages);
};

const PaginationPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const isIndeterminate = state.mode === "indeterminate";
  const isLink = state.navStyle === "link";

  // In link mode the component asks the router context's `Link` to render a real
  // anchor from the getter's href — which would navigate the preview away from the
  // docs page. We swap in a contained Link: it renders href="#", prevents the
  // default navigation, and pages in-place by decoding the target the getters
  // encode as `#page-N`. Stable identity (useMemo, []) so it doesn't remount.
  const PlaygroundLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, LinkProps>(function PlaygroundLink(
        { to, children, onClick, ...rest },
        ref,
      ) {
        const target = typeof to === "string" ? to : (to.pathname ?? "");
        const match = /#page-(-?\d+)/.exec(target);
        return (
          <a
            ref={ref}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (match) {
                const page = Number(match[1]);
                setState((prev) => ({
                  ...prev,
                  currentPage:
                    prev.mode === "indeterminate"
                      ? Math.max(1, page)
                      : clampPage(page, prev.totalItems, prev.pageSize),
                }));
              }
              onClick?.(e);
            }}
            {...(rest as ComponentPropsWithoutRef<"a">)}
          >
            {children}
          </a>
        );
      }),
    [],
  );

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
    } else if (name === "navStyle") {
      set("navStyle", v as NavStyle);
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
    {
      name: "navStyle",
      type: "select",
      options: ["callback", "link"],
      description: "Buttons (callbacks) or anchors (link getters)",
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

  // ⑤ Render the real Pagination from state, mirroring generateCode exactly. The four
  //    branches (mode × nav style) keep the discriminated-union props type-safe. Link
  //    getters encode the target as `#page-N` so the contained Link can page in-place.
  const onPageSizeChange = state.showPageSize
    ? handlePageSizeChange
    : undefined;

  const renderPagination = () => {
    if (isIndeterminate) {
      return isLink ? (
        <Pagination
          indeterminate
          currentPage={state.currentPage}
          hasPrevious={state.currentPage > 1}
          hasNext
          getPrevPageLink={() => `#page-${state.currentPage - 1}`}
          getNextPageLink={() => `#page-${state.currentPage + 1}`}
          pageSize={state.pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      ) : (
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
          onPageSizeChange={onPageSizeChange}
        />
      );
    }

    return isLink ? (
      <Pagination
        totalItems={state.totalItems}
        pageSize={state.pageSize}
        currentPage={state.currentPage}
        getPageLink={(page) => `#page-${page}`}
        onPageSizeChange={onPageSizeChange}
      />
    ) : (
      <Pagination
        totalItems={state.totalItems}
        pageSize={state.pageSize}
        currentPage={state.currentPage}
        goToPage={(p) => set("currentPage", p)}
        onPageSizeChange={onPageSizeChange}
      />
    );
  };

  const preview = (
    <div className="w-[550px] max-w-full">
      <RouterContextProvider Link={PlaygroundLink}>
        {renderPagination()}
      </RouterContextProvider>
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
