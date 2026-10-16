import {
  type ComponentPropsWithoutRef,
  type FC,
  forwardRef,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Breadcrumb,
  Button,
  CopyButton,
  type HeaderV2TabItem,
  IconV2,
  Page,
  TooltipProvider,
} from "@harnessio/ui/components";
import { RouterContextProvider, type NavLinkProps } from "@harnessio/ui/context";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// The Page header has two forms, and this one playground covers both via a
// `component` toggle (the way LogoPlayground folds LogoV2 + LogoSymbol into one):
//   • Page.Header   — the standard header: back link, icon OR logo, title,
//     description, header-right actions, favorite, loading skeleton.
//   • Page.HeaderV2 — the tabbed variant: breadcrumbs, a hero title, a router-driven
//     tab strip (underlined below, or ghost inline in the title row), and actions.
// Several interesting props are ReactNode (actions, breadcrumbs) or object/array
// shapes (backLink, favoriteProps, tabs) the generic Playground can't express, so
// this is bespoke. Both read their scrollable/max-width context from Page.Root, but
// both have sensible defaults, so they render standalone here — and the tab strip
// falls back to the router context's default anchor renderer, so no RouterProvider
// is needed.

// ① Sample slot content shared by BOTH the preview and the generated snippet so
//    the two never drift.
const SAMPLE_ACTIONS: ReactNode = (
  <>
    <Button variant="outline">Settings</Button>
    <Button>New pipeline</Button>
  </>
);
const SAMPLE_HEADER_ACTIONS: ReactNode = (
  <Button variant="outline">Share</Button>
);
const SAMPLE_V2_ACTIONS: ReactNode = <Button>Clone</Button>;

const SAMPLE_TABS: HeaderV2TabItem[] = [
  { label: "Summary", value: "/", exact: true },
  { label: "Files", value: "/files", icon: "empty-page" },
  { label: "Commits", value: "/commits", icon: "git-commit", counter: 12 },
  { label: "Branches", value: "/branches", icon: "git-branch" },
];

const SAMPLE_BREADCRUMBS: ReactNode = (
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Project</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Repository</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
);

const SAMPLE_ACTIONS_CODE = `  actions={
    <>
      <Button variant="outline">Settings</Button>
      <Button>New pipeline</Button>
    </>
  }`;
const SAMPLE_HEADER_ACTIONS_CODE = `  headerActions={<Button variant="outline">Share</Button>}`;
const SAMPLE_V2_ACTIONS_CODE = `  actions={<Button>Clone</Button>}`;
const SAMPLE_TABS_CODE = `  tabs={[
    { label: 'Summary', value: '/', exact: true },
    { label: 'Files', value: '/files', icon: 'empty-page' },
    { label: 'Commits', value: '/commits', icon: 'git-commit', counter: 12 },
    { label: 'Branches', value: '/branches', icon: 'git-branch' },
  ]}`;
const SAMPLE_BREADCRUMBS_CODE = `  breadcrumbs={
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Project</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Repository</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  }`;

// Curated leading glyphs — the header takes either an icon or a logo before the title.
const ICON_NAMES = [
  "empty-page",
  "page",
  "git-branch",
  "settings",
  "folder",
  "database",
];
const LOGO_NAMES = [
  "harness",
  "github",
  "gitlab",
  "docker",
  "kubernetes",
  "aws",
];
const ICON_SIZES = ["2xs", "xs", "sm", "md", "lg", "xl"];

// Passing an Outlet flips the router context out of its v5 code path, so
// Page.HeaderV2's tabs resolve their active state from the NavLink's `isActive`
// (the v6 behaviour the Variation example uses).
const OutletPassthrough = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);

type Component = "Page.Header" | "Page.HeaderV2";

// ② State — a superset; controls show/hide per component.
interface State {
  component: Component;
  title: string;
  description: string;
  leading: "none" | "icon" | "logo";
  iconName: string;
  iconSize: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
  logoName: string;
  // Page.Header only
  backLink: boolean;
  headerActions: boolean;
  favorite: boolean;
  isLoading: boolean;
  // shared
  actions: boolean;
  // Page.HeaderV2 only
  tabs: boolean;
  tabsVariant: "underlined" | "ghost";
  breadcrumbs: boolean;
}

const INITIAL_STATE: State = {
  component: "Page.HeaderV2",
  title: "Pipelines",
  description: "Define, run, and monitor your CI/CD pipelines.",
  leading: "icon",
  iconName: "empty-page",
  iconSize: "lg",
  logoName: "harness",
  backLink: true,
  headerActions: false,
  favorite: false,
  isLoading: false,
  actions: true,
  tabs: true,
  tabsVariant: "underlined",
  breadcrumbs: true,
};

// ③ Mirror exactly what the preview renders — one generator per component. Each
//    emits only the props actually set, and branches on the same conditions the
//    preview does (icon vs logo, tabs variant, etc.).
function generateHeaderCode(s: State): string {
  const attrs: string[] = [`  title="${s.title}"`];

  if (s.leading === "icon") {
    attrs.push(`  iconName="${s.iconName}"`);
    if (s.iconSize !== "lg") attrs.push(`  iconSize="${s.iconSize}"`);
  } else if (s.leading === "logo") {
    attrs.push(`  logoName="${s.logoName}"`);
  }

  if (s.description) attrs.push(`  description="${s.description}"`);
  if (s.backLink) {
    attrs.push(
      `  backLink={{ linkText: 'Back to project', linkProps: { to: '#' } }}`,
    );
  }
  if (s.favorite) {
    attrs.push(
      `  favoriteProps={{ isFavorite: false, onFavoriteToggle: () => {} }}`,
    );
  }
  if (s.isLoading) attrs.push("  isLoading");
  if (s.actions) attrs.push(SAMPLE_ACTIONS_CODE);
  if (s.headerActions) attrs.push(SAMPLE_HEADER_ACTIONS_CODE);

  return ["<Page.Header", ...attrs, "/>"].join("\n");
}

function generateHeaderV2Code(s: State): string {
  const attrs: string[] = [`  title="${s.title}"`];

  if (s.leading === "icon") attrs.push(`  iconName="${s.iconName}"`);
  if (s.description) attrs.push(`  description="${s.description}"`);
  if (s.breadcrumbs) attrs.push(SAMPLE_BREADCRUMBS_CODE);
  if (s.tabs) attrs.push(SAMPLE_TABS_CODE);
  if (s.tabsVariant !== "underlined") {
    attrs.push(`  tabsVariant="${s.tabsVariant}"`);
  }
  if (s.actions) attrs.push(SAMPLE_V2_ACTIONS_CODE);

  return ["<Page.HeaderV2", ...attrs, "/>"].join("\n");
}

const generateCode = (s: State): string =>
  s.component === "Page.HeaderV2"
    ? generateHeaderV2Code(s)
    : generateHeaderCode(s);

const PageHeaderPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // Favorite owns its own pressed state so the star toggles live in the preview.
  const [favorite, setFavorite] = useState(false);
  // The HeaderV2 tabs are router links. There's no real router in the doc site,
  // so we give them a self-contained active state: clicking a tab selects it
  // without navigating, and the links render empty (href="#") — matching how the
  // Variation example's memory router keeps its clicks on the page.
  const [activeTab, setActiveTab] = useState(SAMPLE_TABS[0].value);
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setFavorite(false);
    setActiveTab(SAMPLE_TABS[0].value);
  };

  // A NavLink that selects-without-navigating, so the tab strip is interactive
  // in the preview but never leaves the doc page. Stable identity (empty deps);
  // it reads the latest active tab from a ref so it doesn't need to re-mount.
  const PlaygroundNavLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, NavLinkProps>(function PlaygroundNavLink(
        { to, children, className, style, onClick, end: _end, ...rest },
        ref,
      ) {
        const target = typeof to === "string" ? to : (to.pathname ?? "/");
        const isActive = target === activeTabRef.current;
        const resolvedClassName =
          typeof className === "function"
            ? className({ isActive, isPending: false, isTransitioning: false })
            : className;
        const resolvedStyle =
          typeof style === "function"
            ? style({ isActive, isPending: false, isTransitioning: false })
            : style;
        return (
          <a
            ref={ref}
            href="#"
            className={resolvedClassName}
            style={resolvedStyle}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(target);
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

  const isV2 = state.component === "Page.HeaderV2";

  // ④ Curated control set — the tail differs per component.
  const controls: PropControl[] = [
    {
      name: "component",
      type: "select",
      options: ["Page.Header", "Page.HeaderV2"],
      description: "Standard header, or the tabbed variant",
    },
    { name: "title", type: "text", required: true },
    { name: "description", type: "text", description: "Empty hides the prop" },
    {
      name: "leading",
      type: "select",
      // HeaderV2 has no logo slot.
      options: isV2 ? ["none", "icon"] : ["none", "icon", "logo"],
      description: isV2
        ? "Icon before the title"
        : "Glyph before the title — an icon or a logo",
    },
    {
      name: "iconName",
      type: "select",
      options: ICON_NAMES,
      description: "Used when leading is 'icon'",
    },
    ...(isV2
      ? ([
          {
            name: "tabsVariant",
            type: "select",
            options: ["underlined", "ghost"],
            description: "Tabs below the title, or inline in the title row",
          },
        ] as PropControl[])
      : ([
          {
            name: "iconSize",
            type: "select",
            options: ICON_SIZES,
            description: "Used when leading is 'icon'",
          },
          {
            name: "logoName",
            type: "select",
            options: LOGO_NAMES,
            description: "Used when leading is 'logo'",
          },
        ] as PropControl[])),
    {
      name: "actions",
      type: "boolean",
      description: "Header-right action buttons",
    },
    ...(isV2
      ? ([
          {
            name: "tabs",
            type: "boolean",
            description: "Section-navigation tab strip",
          },
          {
            name: "breadcrumbs",
            type: "boolean",
            description: "Breadcrumb trail above the title",
          },
        ] as PropControl[])
      : ([
          {
            name: "backLink",
            type: "boolean",
            description: "Back navigation link above the title",
          },
          {
            name: "headerActions",
            type: "boolean",
            description: "Actions in the top row, beside the back link",
          },
          {
            name: "favorite",
            type: "boolean",
            description: "Favorite (pin) toggle next to the title",
          },
          {
            name: "isLoading",
            type: "boolean",
            description: "Skeleton placeholders for the glyph and title",
          },
        ] as PropControl[])),
  ];

  const inputControls = controls.filter((c) => c.type !== "boolean");
  const booleanControls = controls.filter((c) => c.type === "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) =>
        prop.name === "component"
          ? // Switching to HeaderV2 while "logo" is selected would leave `leading`
            // outside that component's options, so normalize it to "icon".
            setState((prev) => ({
              ...prev,
              component: v as Component,
              leading:
                v === "Page.HeaderV2" && prev.leading === "logo"
                  ? "icon"
                  : prev.leading,
            }))
          : set(prop.name as keyof State, v as never)
      }
    />
  );

  // ⑤ Render the real component from state, mirroring generateCode exactly.
  const preview = isV2 ? (
    <RouterContextProvider
      NavLink={PlaygroundNavLink}
      Outlet={OutletPassthrough}
    >
      <div className="w-full">
        <Page.HeaderV2
          title={state.title}
          description={state.description || undefined}
          iconName={
            state.leading === "icon" ? (state.iconName as never) : undefined
          }
          breadcrumbs={state.breadcrumbs ? SAMPLE_BREADCRUMBS : undefined}
          tabs={state.tabs ? SAMPLE_TABS : undefined}
          tabsVariant={state.tabsVariant}
          actions={state.actions ? SAMPLE_V2_ACTIONS : undefined}
        />
      </div>
    </RouterContextProvider>
  ) : (
    <div className="w-full">
      <Page.Header
        title={state.title}
        description={state.description || undefined}
        iconName={
          state.leading === "icon" ? (state.iconName as never) : undefined
        }
        iconSize={state.leading === "icon" ? state.iconSize : undefined}
        logoName={
          state.leading === "logo" ? (state.logoName as never) : undefined
        }
        backLink={
          state.backLink
            ? { linkText: "Back to project", linkProps: { to: "#" } }
            : undefined
        }
        favoriteProps={
          state.favorite
            ? { isFavorite: favorite, onFavoriteToggle: setFavorite }
            : undefined
        }
        isLoading={state.isLoading}
        actions={state.actions ? SAMPLE_ACTIONS : undefined}
        headerActions={state.headerActions ? SAMPLE_HEADER_ACTIONS : undefined}
      />
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

export default PageHeaderPlayground;
