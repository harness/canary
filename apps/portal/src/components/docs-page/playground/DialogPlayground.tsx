import { type FC, useMemo, useState } from "react";
import {
  Button,
  ButtonLayout,
  CopyButton,
  Dialog,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import { DialogProvider, TranslationProvider } from "@harnessio/ui/context";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Dialog is an overlay compound component: its content portals to <body> as a
// modal over the whole page, so (unlike the inline playgrounds) the preview
// stage can't contain it. The stage shows the TRIGGER — clicking it opens the
// real dialog over the page, exactly how it behaves in an app.

// Each theme has a matching header icon, mirroring the doc examples. "decoration"
// picks whether the header shows that icon, a logo, or neither (icon and logo are
// mutually exclusive on Header, so a single select keeps the combo always valid).
const THEME_ICON: Record<State["theme"], string> = {
  default: "info-circle",
  warning: "warning-triangle",
  danger: "trash",
};

// ② The state shape — one field per control.
interface State {
  size: "sm" | "md" | "lg" | "max";
  theme: "default" | "warning" | "danger";
  decoration: "none" | "icon" | "logo";
  triggerLabel: string;
  title: string;
  description: string;
  hideClose: boolean;
  scrollableBody: boolean;
}

const INITIAL_STATE: State = {
  size: "md",
  theme: "default",
  decoration: "icon",
  triggerLabel: "Open dialog",
  title: "Generate clone credential",
  description: "Create a token you can use to clone this repository.",
  hideClose: false,
  scrollableBody: false,
};

// Long body used by the scrollable example, shared by preview and snippet.
const LONG_SECTIONS = Array.from({ length: 12 }).map((_, i) => i + 1);

// ③ Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from the component defaults, and mirror exactly what the
//    preview renders.
function generateCode(s: State): string {
  const contentAttrs: string[] = [];
  if (s.size !== "sm") contentAttrs.push(`size="${s.size}"`);
  if (s.hideClose) contentAttrs.push("hideClose");
  const contentOpen = contentAttrs.length
    ? `<Dialog.Content ${contentAttrs.join(" ")}>`
    : "<Dialog.Content>";

  const headerAttrs: string[] = [];
  if (s.decoration === "icon")
    headerAttrs.push(`icon="${THEME_ICON[s.theme]}"`);
  if (s.decoration === "logo") headerAttrs.push('logo="jira"');
  if (s.theme !== "default") headerAttrs.push(`theme="${s.theme}"`);
  const headerOpen = headerAttrs.length
    ? `<Dialog.Header ${headerAttrs.join(" ")}>`
    : "<Dialog.Header>";

  const descLine = s.description
    ? `\n      <Dialog.Description>${s.description}</Dialog.Description>`
    : "";

  const body = s.scrollableBody
    ? `
    <Dialog.Body>
      {sections.map((n) => (
        <div key={n}>
          <Text variant="heading-subsection" as="h4">Section {n}</Text>
          <p className="font-body-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      ))}
    </Dialog.Body>`
    : "";

  return `<Dialog.Root>
  <Dialog.Trigger>
    <Button>${s.triggerLabel}</Button>
  </Dialog.Trigger>
  ${contentOpen}
    ${headerOpen}
      <Dialog.Title>${s.title}</Dialog.Title>${descLine}
    </Dialog.Header>${body}
    <Dialog.Footer>
      <ButtonLayout>
        <Dialog.Close>Cancel</Dialog.Close>
        <Button>Confirm</Button>
      </ButtonLayout>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>`;
}

const DialogPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // The dialog is uncontrolled; bump this on reset so the keyed Root remounts
  // and an open dialog closes back to its initial state.
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
      name: "size",
      type: "select",
      options: ["sm", "md", "lg", "max"],
      description: "Width of the dialog ('max' is 80% of the viewport)",
    },
    {
      name: "theme",
      type: "select",
      options: ["default", "warning", "danger"],
      description: "Header theme and its matching icon",
    },
    {
      name: "decoration",
      type: "select",
      options: ["none", "icon", "logo"],
      description: "Show a themed icon, a logo, or neither in the header",
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
    {
      name: "description",
      type: "text",
      description: "Supporting text below the title",
    },
    {
      name: "hideClose",
      type: "boolean",
      description: "Hide the ✕ button in the top-right corner",
    },
    {
      name: "scrollableBody",
      type: "boolean",
      description: "Add a long, scrolling Body region",
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
    <Dialog.Root key={nonce}>
      <Dialog.Trigger>
        <Button>{state.triggerLabel}</Button>
      </Dialog.Trigger>
      <Dialog.Content size={state.size} hideClose={state.hideClose}>
        <Dialog.Header
          icon={
            state.decoration === "icon"
              ? (THEME_ICON[state.theme] as never)
              : undefined
          }
          logo={state.decoration === "logo" ? "jira" : undefined}
          theme={state.theme}
        >
          <Dialog.Title>{state.title}</Dialog.Title>
          {state.description ? (
            <Dialog.Description>{state.description}</Dialog.Description>
          ) : null}
        </Dialog.Header>
        {state.scrollableBody ? (
          <Dialog.Body>
            <div className="space-y-cn-md">
              {LONG_SECTIONS.map((n) => (
                <div key={n}>
                  <h4 className="font-heading-subsection">Section {n}</h4>
                  <p className="font-body-normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              ))}
            </div>
          </Dialog.Body>
        ) : null}
        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close>Cancel</Dialog.Close>
            <Button>Confirm</Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
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

export default DialogPlayground;
