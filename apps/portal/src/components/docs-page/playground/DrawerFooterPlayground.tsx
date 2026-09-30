import { type FC, type ReactNode, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  Drawer,
  IconV2,
  Text,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

/**
 * Bespoke, Storybook-style playground for the structured `Drawer.Footer`
 * (passing any button prop opts into the structured action bar).
 *
 * Like the `Drawer.Header` playground, the generic schema-driven `Playground`
 * can't drive this: the footer needs a Drawer (vaul) context so a
 * `Drawer.Close`-wrapped button resolves, and its interesting props
 * (`primaryButton` / `secondaryButton` / `tertiaryButton`, the `children` slot)
 * are `ReactNode`s, not the primitives the generic controls cover. So this reuses
 * the kit's pieces — `ControlField` and the preview frame — but supplies a curated
 * control set and renders the footer inside an inline, always-open drawer context.
 *
 * Each button is driven by a text control holding its *label*: an empty string
 * hides that button (mapped to `undefined`), matching the "empty hides the prop"
 * caption convention.
 */

interface State {
  primaryButton: string;
  secondaryButton: string;
  tertiaryButton: string;
  slot: boolean;
  primaryLoading: boolean;
  primaryDisabled: boolean;
}

// Defaults for the initial render and the "reset" button.
const INITIAL_STATE: State = {
  primaryButton: "Save",
  secondaryButton: "Cancel",
  tertiaryButton: "Back",
  slot: false,
  primaryLoading: false,
  primaryDisabled: false,
};

function indent(block: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return block
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n");
}

function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.tertiaryButton)
    attrs.push(
      `tertiaryButton={<Button variant="ghost">${s.tertiaryButton}</Button>}`,
    );
  if (s.secondaryButton)
    attrs.push(
      `secondaryButton={\n  <Drawer.Close asChild>\n    <Button variant="outline">${s.secondaryButton}</Button>\n  </Drawer.Close>\n}`,
    );
  if (s.primaryButton) {
    const flags = [
      s.primaryLoading ? "loading" : "",
      s.primaryDisabled ? "disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const openTag = flags ? `<Button ${flags}>` : "<Button>";
    attrs.push(`primaryButton={${openTag}${s.primaryButton}</Button>}`);
  }

  const body = indent(attrs.join("\n"), 2);
  const open = attrs.length ? `<Drawer.Footer\n${body}` : "<Drawer.Footer";
  // The slot renders above the action bar; mirror it in the snippet whenever it's on.
  return s.slot
    ? `${open}\n>\n  <Text color="foreground-3">Changes are saved to your workspace.</Text>\n</Drawer.Footer>`
    : `${open}\n/>`;
}

const DrawerFooterPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    {
      name: "primaryButton",
      type: "text",
      description: "Empty hides the button",
    },
    {
      name: "secondaryButton",
      type: "text",
      description: "Empty hides the button",
    },
    {
      name: "tertiaryButton",
      type: "text",
      description: "Empty hides it (ghost, pinned left)",
    },
    {
      name: "slot",
      type: "boolean",
      description: "Show content above the action bar",
    },
    {
      name: "primaryLoading",
      type: "boolean",
      description: "Loading state on primary",
    },
    {
      name: "primaryDisabled",
      type: "boolean",
      description: "Disable the primary button",
    },
  ];

  // Split so the boolean toggles hard-break onto their own row(s) instead of
  // flowing inline after the text controls.
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

  const primaryNode: ReactNode = state.primaryButton ? (
    <Button loading={state.primaryLoading} disabled={state.primaryDisabled}>
      {state.primaryButton}
    </Button>
  ) : undefined;

  const secondaryNode: ReactNode = state.secondaryButton ? (
    <Drawer.Close asChild>
      <Button variant="outline">{state.secondaryButton}</Button>
    </Drawer.Close>
  ) : undefined;

  const tertiaryNode: ReactNode = state.tertiaryButton ? (
    <Button variant="ghost">{state.tertiaryButton}</Button>
  ) : undefined;

  const footer = (
    <Drawer.Footer
      primaryButton={primaryNode}
      secondaryButton={secondaryNode}
      tertiaryButton={tertiaryNode}
    >
      {state.slot ? (
        <Text color="foreground-3">Changes are saved to your workspace.</Text>
      ) : undefined}
    </Drawer.Footer>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* Inline, always-open drawer context so a Drawer.Close-wrapped button
            resolves without portaling into an overlay — the footer stays on screen
            beside the controls. The bordered panel stands in for Drawer.Content. */}
        <div className="bg-cn-2 relative flex justify-center p-cn-3xl">
          {/* Reset the controls to their defaults. */}
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
          <Drawer.Root open modal={false} onOpenChange={() => {}}>
            {/* Stands in for Drawer.Content — matches the drawer panel's radius,
                border and shadow. A short, clipped body peek sits above the footer
                so it reads as the bottom of a real drawer rather than a floating card. */}
            <div className="bg-cn-1 shadow-cn-5 flex w-full max-w-[520px] flex-col overflow-hidden rounded-cn-4 border">
              {/* Body peek: real Drawer.Body for authentic padding and the top fade,
                  capped to a short fixed height and clipped so the content visibly
                  continues above the fold. Placeholder bars stand in for real content. */}
              <Drawer.Body
                scrollable={false}
                className="cn-drawer-body-wrap-bottom !h-[140px] !flex-none"
              >
                <div className="flex flex-col gap-cn-sm" aria-hidden>
                  <div className="bg-cn-gray-secondary h-2 w-11/12 rounded" />
                  <div className="bg-cn-gray-secondary h-2 w-full rounded" />
                  <div className="bg-cn-gray-secondary h-2 w-4/5 rounded" />
                  <div className="bg-cn-gray-secondary h-2 w-2/3 rounded" />
                </div>
              </Drawer.Body>
              {footer}
            </div>
          </Drawer.Root>
        </div>

        {/* Input-type controls (text). bg-cn-1 (not cn-2): the DS inputs fill with
            bg-cn-2, so they need a cn-1 surface underneath to read as fields. */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
        </div>

        {/* Hard break: boolean toggles start on their own row(s), separated from
            the input-type controls by a divider instead of flowing inline. */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {booleanControls.map(renderControl)}
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
              otherwise collapse the multi-line snippet onto one line. */}
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

export default DrawerFooterPlayground;
