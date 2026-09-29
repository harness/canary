import { type FC, type ReactNode, useMemo, useState } from "react";
import {
  Button,
  ButtonLayout,
  CopyButton,
  Drawer,
  Layout,
  Tabs,
  Text,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

/**
 * Bespoke, Storybook-style playground for the structured `Drawer.Header`
 * (passing a `title` opts into the structured layout; `Drawer.HeaderV2` is a
 * deprecated alias for the same thing).
 *
 * The generic schema-driven `Playground` can't drive this component: the header
 * needs a Drawer (vaul) context for its Title/Description/Close, and its most
 * interesting props (`actions`, `tabs`, `icon`, metadata `children`) are
 * ReactNode/unions rather than the primitives the generic controls cover. So
 * this reuses the kit's pieces — `ControlField` and the preview frame — but
 * supplies a curated control set and renders the header inside an inline,
 * always-open drawer context so the props resolve without a portal/overlay.
 */

// Sample content, shared by the live preview and the generated code snippet so
// the two never drift.
const SAMPLE_ICON = "settings";
const SAMPLE_LOGO = "harness";
const SAMPLE_TABS = [
  { label: "Overview", value: "overview" },
  { label: "Logs", value: "logs" },
  { label: "Artifacts", value: "artifacts", counter: 3 },
  { label: "Tests", value: "tests", disabled: true },
];

type IconChoice = "none" | "icon" | "logo";

interface State {
  title: string;
  tagline: string;
  description: string;
  icon: IconChoice;
  actions: boolean;
  tabs: boolean;
  metadata: boolean;
  hideClose: boolean;
  isLoading: boolean;
}

function indent(block: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return block
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n");
}

function generateCode(s: State): string {
  const attrs: string[] = [`title="${s.title}"`];
  if (s.tagline) attrs.push(`tagline="${s.tagline}"`);
  if (s.description) attrs.push(`description="${s.description}"`);
  if (s.icon === "icon") attrs.push(`icon="${SAMPLE_ICON}"`);
  else if (s.icon === "logo") attrs.push(`icon={{ logo: "${SAMPLE_LOGO}" }}`);
  if (s.hideClose) attrs.push("hideClose");
  if (s.isLoading) attrs.push("isLoading");
  if (s.actions)
    attrs.push(
      `actions={\n  <ButtonLayout.Root>\n    <ButtonLayout.Primary>\n      <Button size="sm">Deploy</Button>\n    </ButtonLayout.Primary>\n    <ButtonLayout.Secondary>\n      <Button size="sm" variant="outline">Edit</Button>\n    </ButtonLayout.Secondary>\n  </ButtonLayout.Root>\n}`,
    );
  if (s.tabs)
    attrs.push(
      `tabs={[\n  { label: "Overview", value: "overview" },\n  { label: "Logs", value: "logs" },\n  { label: "Artifacts", value: "artifacts", counter: 3 },\n  { label: "Tests", value: "tests", disabled: true },\n]}`,
    );

  const body = indent(attrs.join("\n"), 2);
  const open = `<Drawer.Header\n${body}`;
  // isLoading skeletons the children (metadata) slot, so the snippet shows children
  // whenever metadata OR isLoading is set — matching what the preview renders.
  const header =
    s.metadata || s.isLoading
      ? `${open}\n>\n  <Layout.Horizontal gap="lg">\n    <Text color="foreground-3">Last deployed: 2 hours ago</Text>\n    <Text color="foreground-3">Region: us-west-2</Text>\n  </Layout.Horizontal>\n</Drawer.Header>`
      : `${open}\n/>`;

  // With tabs, the header must sit inside a Tabs.Root for the strip to switch.
  return s.tabs ? `<Tabs.Root value={tab} onValueChange={setTab}>\n${indent(header, 2)}\n</Tabs.Root>` : header;
}

const DrawerHeaderPlayground: FC = () => {
  const [state, setState] = useState<State>({
    title: "Pipeline Settings",
    tagline: "",
    description: "Configure your pipeline execution settings",
    icon: "icon",
    actions: false,
    tabs: false,
    metadata: false,
    hideClose: false,
    isLoading: false,
  });
  const [activeTab, setActiveTab] = useState("overview");

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const controls: PropControl[] = [
    { name: "title", type: "text", required: true },
    { name: "tagline", type: "text" },
    { name: "description", type: "text" },
    {
      name: "icon",
      type: "select",
      options: ["none", "icon", "logo"],
      description: "None, an IconV2, or a product LogoV2",
    },
    { name: "actions", type: "boolean", description: "Show sample action buttons" },
    { name: "tabs", type: "boolean", description: "Show a sample tab strip" },
    { name: "metadata", type: "boolean", description: "Show sample metadata slot" },
    { name: "hideClose", type: "boolean" },
    {
      name: "isLoading",
      type: "boolean",
      description: "Skeletons the metadata slot and hides actions",
    },
  ];

  const iconProp =
    state.icon === "icon"
      ? SAMPLE_ICON
      : state.icon === "logo"
        ? { logo: SAMPLE_LOGO }
        : undefined;

  const actionsNode: ReactNode = state.actions ? (
    <ButtonLayout.Root>
      <ButtonLayout.Primary>
        <Button size="sm">Deploy</Button>
      </ButtonLayout.Primary>
      <ButtonLayout.Secondary>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </ButtonLayout.Secondary>
    </ButtonLayout.Root>
  ) : undefined;

  // `isLoading` renders a skeleton in place of the metadata slot (children) and
  // hides actions — it has no other visible effect. So surface the metadata slot
  // whenever metadata OR isLoading is on; otherwise toggling isLoading alone would
  // have nothing to skeletonize and appear to do nothing.
  const showMetadata = state.metadata || state.isLoading;
  const metadataNode: ReactNode = showMetadata ? (
    <Layout.Horizontal gap="lg">
      <Text color="foreground-3">Last deployed: 2 hours ago</Text>
      <Text color="foreground-3">Region: us-west-2</Text>
    </Layout.Horizontal>
  ) : undefined;

  const header = (
    <Drawer.Header
      title={state.title}
      tagline={state.tagline || undefined}
      description={state.description || undefined}
      icon={iconProp}
      actions={actionsNode}
      tabs={state.tabs ? SAMPLE_TABS : undefined}
      hideClose={state.hideClose}
      isLoading={state.isLoading}
    >
      {metadataNode}
    </Drawer.Header>
  );

  const preview = state.tabs ? (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      {header}
    </Tabs.Root>
  ) : (
    header
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* Inline, always-open drawer context so Drawer.Title/Description/Close
            resolve without portaling into an overlay — the header stays on screen
            beside the controls. The bordered panel stands in for Drawer.Content. */}
        <div className="bg-cn-2 flex justify-center p-cn-3xl">
          <Drawer.Root open modal={false} onOpenChange={() => {}}>
            {/* Stands in for Drawer.Content — matches the drawer panel's radius,
                border and shadow, and shows a short, clipped peek of the body
                below the header so the header reads as the top of a real drawer
                rather than a floating card. */}
            <div className="bg-cn-1 shadow-cn-5 flex w-full max-w-[520px] flex-col overflow-hidden rounded-cn-4 border">
              {preview}
              {/* Body peek: real Drawer.Body for authentic padding and the
                  bottom fade, capped to a short fixed height and clipped so the
                  content visibly continues past the fold. Placeholder bars stand
                  in for whatever content the drawer would hold. */}
              <Drawer.Body
                scrollable={false}
                className="cn-drawer-body-wrap-top !h-[140px] !flex-none"
              >
                <div className="flex flex-col gap-cn-sm" aria-hidden>
                  <div className="bg-cn-gray-secondary h-2 w-11/12 rounded" />
                  <div className="bg-cn-gray-secondary h-2 w-full rounded" />
                  <div className="bg-cn-gray-secondary h-2 w-4/5 rounded" />
                  <div className="bg-cn-gray-secondary h-2 w-2/3 rounded" />
                </div>
              </Drawer.Body>
            </div>
          </Drawer.Root>
        </div>

        {/* bg-cn-1 (not cn-2): the DS Input fills with bg-cn-2, so it needs a
            cn-1 surface underneath to read as a field rather than a faint outline. */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {controls.map((prop) => (
            <ControlField
              key={prop.name}
              prop={prop}
              value={state[prop.name as keyof State]}
              onChange={(v) => set(prop.name as keyof State, v as never)}
            />
          ))}
        </div>

        <details className="example-expand bg-cn-2 relative border-t p-cn-sm">
          <CopyButton
            buttonVariant="transparent"
            className="absolute right-cn-sm top-cn-sm"
            name={code}
          />
          <summary className="flex cursor-pointer select-none items-center gap-cn-3xs text-cn-size-2">
            Show code
          </summary>
          {/* Text sits directly in <pre> (no inner <code>): the global
              `code { white-space: nowrap !important }` rule in styles.css would
              otherwise collapse the multi-line snippet onto one line and give it
              an inline-code background. */}
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

export default DrawerHeaderPlayground;
