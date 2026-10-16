import { type FC, type ReactNode, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Page,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Page.Header is the standard page header: a back link, a leading icon OR logo,
// the title, a description, and header-right actions. Several of its interesting
// props are ReactNode (actions, headerActions) or object shapes (backLink,
// favoriteProps) that the generic schema-driven Playground can't express, so this
// is a bespoke playground. The header reads its scrollable/max-width context from
// Page.Root, but both have sensible defaults, so it renders standalone here — the
// same way the doc's static example does.

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

const SAMPLE_ACTIONS_CODE = `  actions={
    <>
      <Button variant="outline">Settings</Button>
      <Button>New pipeline</Button>
    </>
  }`;
const SAMPLE_HEADER_ACTIONS_CODE = `  headerActions={<Button variant="outline">Share</Button>}`;

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

// ② State — one field per control.
interface State {
  title: string;
  description: string;
  leading: "none" | "icon" | "logo";
  iconName: string;
  iconSize: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
  logoName: string;
  backLink: boolean;
  actions: boolean;
  headerActions: boolean;
  favorite: boolean;
  isLoading: boolean;
}

const INITIAL_STATE: State = {
  title: "Pipelines",
  description: "Define, run, and monitor your CI/CD pipelines.",
  leading: "icon",
  iconName: "empty-page",
  iconSize: "lg",
  logoName: "harness",
  backLink: true,
  actions: true,
  headerActions: false,
  favorite: false,
  isLoading: false,
};

// ③ Mirror exactly what the preview renders. The leading glyph is an icon OR a
//    logo (never both), and iconSize only applies to the icon — same branches the
//    preview takes.
function generateCode(s: State): string {
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

const PageHeaderPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // Favorite owns its own pressed state so the star toggles live in the preview.
  const [favorite, setFavorite] = useState(false);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setFavorite(false);
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "title", type: "text", required: true },
    {
      name: "description",
      type: "text",
      description: "Empty hides the prop",
    },
    {
      name: "leading",
      type: "select",
      options: ["none", "icon", "logo"],
      description: "Glyph before the title — an icon or a logo",
    },
    {
      name: "iconName",
      type: "select",
      options: ICON_NAMES,
      description: "Used when leading is 'icon'",
    },
    {
      name: "iconSize",
      type: "select",
      options: ["2xs", "xs", "sm", "md", "lg", "xl"],
      description: "Used when leading is 'icon'",
    },
    {
      name: "logoName",
      type: "select",
      options: LOGO_NAMES,
      description: "Used when leading is 'logo'",
    },
    {
      name: "backLink",
      type: "boolean",
      description: "Back navigation link above the title",
    },
    {
      name: "actions",
      type: "boolean",
      description: "Header-right action buttons",
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

  // ⑤ Render the real Page.Header from state, mirroring generateCode exactly.
  const preview = (
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
