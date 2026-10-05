import { type FC, useMemo, useState } from "react";
import {
  AlertItem,
  Button,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// ① Sample content shared by BOTH the live preview and the generated snippet,
//    so the two never drift. AlertItem renders a plain <a> for `to` / `AlertItem.Link`
//    when no router context is present, so no provider is needed here.
const SAMPLE_ROW_TO = "/alerts/1";
const SAMPLE_LINK_TO = "/subscription";
const SAMPLE_LINK_LABEL = "View subscription";
const SAMPLE_TIMESTAMP_SRC = "Date.now() - 3 * 60 * 60 * 1000"; // ~3 hours ago

// Row navigation renders an overlay: a link (`to`) or a button (`onClick`).
type RowNavigation = "none" | "link" | "button";

// ② The state shape — one field per control.
interface State {
  theme: "info" | "success" | "warning" | "danger";
  title: string;
  description: string;
  rowNavigation: RowNavigation;
  read: boolean;
  showTimestamp: boolean;
  showLink: boolean;
}

// ② Defaults, hoisted so the reset button can reuse them.
const INITIAL_STATE: State = {
  theme: "info",
  title: "Pipeline failed",
  description: "Build #2481 failed at the integration stage.",
  rowNavigation: "link",
  read: false,
  showTimestamp: true,
  showLink: true,
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Only emit props that differ from the component defaults, and mirror exactly
//    what the preview renders.
function generateCode(s: State): string {
  const attrs: string[] = [`theme="${s.theme}"`];
  if (!s.read) attrs.push("read={false}"); // default is read
  if (s.showTimestamp) attrs.push(`timestamp={${SAMPLE_TIMESTAMP_SRC}}`);
  if (s.rowNavigation === "link") attrs.push(`to="${SAMPLE_ROW_TO}"`);
  if (s.rowNavigation === "button") attrs.push("onClick={() => {}}");

  const children: string[] = [
    `  <AlertItem.Title>${s.title}</AlertItem.Title>`,
  ];
  if (s.description)
    children.push(
      `  <AlertItem.Description>${s.description}</AlertItem.Description>`,
    );
  if (s.showLink)
    children.push(
      `  <AlertItem.Link to="${SAMPLE_LINK_TO}">${SAMPLE_LINK_LABEL}</AlertItem.Link>`,
    );

  return `<AlertItem ${attrs.join(" ")}>\n${children.join("\n")}\n</AlertItem>`;
}

const AlertItemPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "theme",
      type: "select",
      options: ["info", "success", "warning", "danger"],
      required: true,
      description: "Left accent color — match it to the severity",
    },
    { name: "title", type: "text", required: true },
    {
      name: "description",
      type: "text",
      description: "Empty hides the description",
    },
    {
      name: "rowNavigation",
      type: "select",
      options: ["none", "link", "button"],
      description: "Make the whole row navigate (to) or act (onClick)",
    },
    {
      name: "read",
      type: "boolean",
      description: "Unread rows get a tinted background and a dot",
    },
    {
      name: "showTimestamp",
      type: "boolean",
      description: "Show a relative timestamp on the right",
    },
    {
      name: "showLink",
      type: "boolean",
      description: "Secondary action link below the text",
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

  // ⑤ Render the real component from state. Row navigation is mutually exclusive:
  //    `to` renders a link overlay, `onClick` a button overlay.
  const timestamp = Date.now() - 3 * 60 * 60 * 1000;
  const preview = (
    <AlertItem
      theme={state.theme}
      read={state.read}
      {...(state.showTimestamp ? { timestamp } : {})}
      {...(state.rowNavigation === "link" ? { to: SAMPLE_ROW_TO } : {})}
      {...(state.rowNavigation === "button" ? { onClick: () => {} } : {})}
    >
      <AlertItem.Title>{state.title}</AlertItem.Title>
      {state.description && (
        <AlertItem.Description>{state.description}</AlertItem.Description>
      )}
      {state.showLink && (
        <AlertItem.Link to={SAMPLE_LINK_TO}>{SAMPLE_LINK_LABEL}</AlertItem.Link>
      )}
    </AlertItem>
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

export default AlertItemPlayground;
