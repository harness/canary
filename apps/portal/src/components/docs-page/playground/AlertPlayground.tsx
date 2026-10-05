import { type FC, useMemo, useState } from "react";
import {
  Alert,
  Button,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// ① Sample content shared by BOTH the live preview and the generated snippet,
//    so the two never drift. Alert.Link renders a plain <a> for `to` when no
//    router context is present, so no provider is needed here.
const SAMPLE_LINK_TO = "/docs";
const SAMPLE_LINK_LABEL = "Learn more";

// ② The state shape — one field per control.
interface State {
  theme: "info" | "success" | "warning" | "danger";
  title: string;
  description: string;
  showLink: boolean;
  dismissible: boolean;
  expandable: boolean;
}

// ② Defaults, hoisted so the reset button can reuse them.
const INITIAL_STATE: State = {
  theme: "info",
  title: "Heads up",
  description:
    "Repositories are cloned using tokens by default. You can optionally provide an SSH key to override this behavior and clone using git+ssh.",
  showLink: true,
  dismissible: false,
  expandable: false,
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Only emit props that differ from the component defaults, and mirror exactly
//    what the preview renders.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.theme !== "info") attrs.push(`theme="${s.theme}"`); // default is info
  if (s.dismissible) attrs.push("dismissible");
  if (s.expandable) attrs.push("expandable");
  const openTag = attrs.length
    ? `<Alert.Root ${attrs.join(" ")}>`
    : `<Alert.Root>`;

  const children: string[] = [];
  if (s.title) children.push(`  <Alert.Title>${s.title}</Alert.Title>`);
  children.push(`  <Alert.Description>${s.description}</Alert.Description>`);
  if (s.showLink)
    children.push(
      `  <Alert.Link to="${SAMPLE_LINK_TO}">${SAMPLE_LINK_LABEL}</Alert.Link>`,
    );

  return `${openTag}\n${children.join("\n")}\n</Alert.Root>`;
}

const AlertPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // `dismissible` removes the alert from the DOM on close; bump this on reset so
  // the keyed Alert.Root remounts and a dismissed alert comes back.
  const [nonce, setNonce] = useState(0);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setNonce((n) => n + 1);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "theme",
      type: "select",
      options: ["info", "success", "warning", "danger"],
      description: "Sets the color and the leading status icon",
    },
    {
      name: "title",
      type: "text",
      description: "Optional heading — empty hides it",
    },
    { name: "description", type: "text", required: true },
    {
      name: "showLink",
      type: "boolean",
      description: "A single follow-up action link",
    },
    {
      name: "dismissible",
      type: "boolean",
      description: "Adds a close button (reset to restore)",
    },
    {
      name: "expandable",
      type: "boolean",
      description: "Collapses long content behind Show more (when it overflows)",
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

  // ⑤ Render the real component from state.
  const preview = (
    <Alert.Root
      key={nonce}
      theme={state.theme}
      dismissible={state.dismissible}
      expandable={state.expandable}
    >
      {state.title && <Alert.Title>{state.title}</Alert.Title>}
      <Alert.Description>{state.description}</Alert.Description>
      {state.showLink && (
        <Alert.Link to={SAMPLE_LINK_TO}>{SAMPLE_LINK_LABEL}</Alert.Link>
      )}
    </Alert.Root>
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

          <div className="w-full max-w-xl">{preview}</div>
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

export default AlertPlayground;
