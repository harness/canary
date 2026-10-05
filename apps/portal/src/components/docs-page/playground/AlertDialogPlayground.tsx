import { type FC, useMemo, useState } from "react";
import {
  AlertDialog,
  Button,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import { DialogProvider, TranslationProvider } from "@harnessio/ui/context";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// AlertDialog is an overlay: its content portals to <body> as a full-screen
// modal, so (unlike the inline playgrounds) the preview stage can't contain it.
// Instead the stage shows the TRIGGER — clicking it opens the real dialog over
// the whole page, which is exactly how it behaves in an app.

// ② The state shape — one field per control.
interface State {
  theme: "default" | "warning" | "danger";
  triggerLabel: string;
  title: string;
  message: string;
  confirmLabel: string;
  loading: boolean;
}

// Per-theme example content, mirroring the static example grid. Picking a theme
// loads its matching trigger/title/message/confirm so the playground shows the
// same canonical example for each theme — the text fields stay editable after.
type ThemeContent = Pick<
  State,
  "triggerLabel" | "title" | "message" | "confirmLabel"
>;
const THEME_PRESETS: Record<State["theme"], ThemeContent> = {
  default: {
    triggerLabel: "Publish changes",
    title: "Publish changes",
    message:
      "Your changes will be visible to everyone with access to this project.",
    confirmLabel: "Confirm",
  },
  warning: {
    triggerLabel: "Discard draft",
    title: "Discard draft?",
    message: "This draft has unsaved edits. Discarding it will lose those changes.",
    confirmLabel: "Confirm",
  },
  danger: {
    triggerLabel: "Delete pipeline",
    title: "Delete pipeline",
    message:
      "Are you sure you want to delete this pipeline? This action cannot be undone.",
    confirmLabel: "Delete",
  },
};

// ② Defaults, hoisted so the reset button can reuse them. Opens on the danger
//    example, the most illustrative (destructive) case.
const INITIAL_STATE: State = {
  theme: "danger",
  ...THEME_PRESETS.danger,
  loading: false,
};

// A custom confirm label is only emitted when it differs from the component's
// built-in default ("Confirm"); otherwise the default button is used.
const hasCustomConfirm = (label: string) => {
  const trimmed = label.trim();
  return trimmed.length > 0 && trimmed !== "Confirm";
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Only emit props that differ from the component defaults, and mirror exactly
//    what the preview renders.
function generateCode(s: State): string {
  const rootAttrs: string[] = [];
  if (s.theme !== "default") rootAttrs.push(`theme="${s.theme}"`);
  if (s.loading) rootAttrs.push("loading");
  rootAttrs.push("onConfirm={() => {}}");

  const confirmLine = hasCustomConfirm(s.confirmLabel)
    ? `\n    <AlertDialog.Confirm>${s.confirmLabel}</AlertDialog.Confirm>`
    : "";

  return `<AlertDialog.Root ${rootAttrs.join(" ")}>
  <AlertDialog.Trigger>
    <Button>${s.triggerLabel}</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content title="${s.title}">
    ${s.message}${confirmLine}
  </AlertDialog.Content>
</AlertDialog.Root>`;
}

const AlertDialogPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // The dialog is uncontrolled; bump this on reset so the keyed Root remounts
  // and an open dialog closes back to its initial state.
  const [nonce, setNonce] = useState(0);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  // Switching theme also swaps in that theme's example content (trigger/title/
  // message/confirm); the user can still tweak the text afterwards.
  const applyTheme = (theme: State["theme"]) =>
    setState((prev) => ({ ...prev, theme, ...THEME_PRESETS[theme] }));

  const reset = () => {
    setState(INITIAL_STATE);
    setNonce((n) => n + 1);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "theme",
      type: "select",
      options: ["default", "warning", "danger"],
      description: "Loads that theme's example and sets the icon + confirm color",
    },
    {
      name: "triggerLabel",
      type: "text",
      required: true,
      description: "Text on the button that opens the dialog",
    },
    {
      name: "title",
      type: "text",
      required: true,
      description: "Heading and the dialog's accessible name",
    },
    { name: "message", type: "text", description: "Body text" },
    {
      name: "confirmLabel",
      type: "text",
      description: "Confirm button text (defaults to Confirm)",
    },
    {
      name: "loading",
      type: "boolean",
      description: "Holds the dialog open with a spinner; disables both buttons",
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
      onChange={(v) =>
        prop.name === "theme"
          ? applyTheme(v as State["theme"])
          : set(prop.name as keyof State, v as never)
      }
    />
  );

  // ⑤ Render the real component from state. `onConfirm` is intentionally a no-op:
  //    confirming does not close the dialog on its own (that's the component's
  //    contract) — Cancel, Esc, the backdrop, and the ✕ dismiss it.
  const preview = (
    <AlertDialog.Root
      key={nonce}
      theme={state.theme}
      loading={state.loading}
      onConfirm={() => {}}
    >
      <AlertDialog.Trigger>
        <Button>{state.triggerLabel}</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content title={state.title}>
        {state.message}
        {hasCustomConfirm(state.confirmLabel) && (
          <AlertDialog.Confirm>{state.confirmLabel}</AlertDialog.Confirm>
        )}
      </AlertDialog.Content>
    </AlertDialog.Root>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TranslationProvider>
      <TooltipProvider>
        <DialogProvider>
          <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
            {/* --- Preview stage: shows the trigger; the dialog opens over the page --- */}
            <div className="bg-cn-2 relative flex flex-col items-center gap-cn-xs p-cn-3xl">
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
              <span className="text-cn-size-1 text-cn-3">
                Opens as a modal over the page
              </span>
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
        </DialogProvider>
      </TooltipProvider>
    </TranslationProvider>
  );
};

export default AlertDialogPlayground;
