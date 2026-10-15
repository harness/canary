import { type FC, useMemo, useState } from "react";
import { Button, CopyButton, IconV2, Link, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Link is a styled anchor. `variant` and `size` pick its treatment, `prefixIcon`/`suffixIcon`
// add the default chevron/arrow glyphs, and `disabled`/`noHoverUnderline` tweak its behavior.
// Its wrinkle is a discriminated union on `external`: the default renders the app router link
// (takes `to`), while `external` renders a plain <a> (takes `href`) — so the preview and
// generated code branch on it.
interface State {
  content: string;
  variant: "default" | "secondary";
  size: "md" | "sm";
  prefixIcon: boolean;
  suffixIcon: boolean;
  external: boolean;
  disabled: boolean;
  noHoverUnderline: boolean;
}

const INITIAL_STATE: State = {
  content: "Link",
  variant: "default",
  size: "md",
  prefixIcon: false,
  suffixIcon: false,
  external: false,
  disabled: false,
  noHoverUnderline: false,
};

// Mirror the preview: emit `variant`/`size` only when they differ from the defaults, the
// boolean flags when set, and the right destination prop for the chosen link kind.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.variant !== "default") attrs.push(`variant="${s.variant}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.prefixIcon) attrs.push("prefixIcon");
  if (s.suffixIcon) attrs.push("suffixIcon");
  if (s.external) {
    attrs.push("external");
    attrs.push('href="#"');
  } else {
    attrs.push('to="#"');
  }
  if (s.disabled) attrs.push("disabled");
  if (s.noHoverUnderline) attrs.push("noHoverUnderline");
  return `<Link ${attrs.join(" ")}>${s.content}</Link>`;
}

const LinkPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    { name: "content", type: "text", description: "The link text" },
    {
      name: "variant",
      type: "select",
      options: ["default", "secondary"],
      description: "Visual treatment",
    },
    { name: "size", type: "select", options: ["md", "sm"], description: "Link scale" },
    {
      name: "prefixIcon",
      type: "boolean",
      description: "Leading chevron (nav-arrow-left)",
    },
    {
      name: "suffixIcon",
      type: "boolean",
      description: "Trailing arrow (arrow-up-right)",
    },
    {
      name: "external",
      type: "boolean",
      description: "Renders a plain <a> with href instead of the router link",
    },
    { name: "disabled", type: "boolean", description: "Blocks clicks and dims the link" },
    {
      name: "noHoverUnderline",
      type: "boolean",
      description: "Removes the underline shown on hover",
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

  // Shared props for both branches of the discriminated union.
  const commonProps = {
    variant: state.variant,
    size: state.size,
    prefixIcon: state.prefixIcon || undefined,
    suffixIcon: state.suffixIcon || undefined,
    disabled: state.disabled,
    noHoverUnderline: state.noHoverUnderline,
  };

  // Two branches keep the `external` union happy: external takes `href`, internal takes `to`.
  const preview = state.external ? (
    <Link external href="#" {...commonProps}>
      {state.content}
    </Link>
  ) : (
    <Link to="#" {...commonProps}>
      {state.content}
    </Link>
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

export default LinkPlayground;
