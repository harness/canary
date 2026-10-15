import { type FC, useMemo, useState } from "react";
import { Button, ButtonLayout, CopyButton, IconV2, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// ButtonLayout is a presentational wrapper — it only positions the buttons you put
// inside it. The buttons are fixed; the controls drive the layout props so you can
// see how orientation and alignment move a primary + supporting action set. The
// `composition` control swaps between passing buttons directly to ButtonLayout and
// the ButtonLayout.Primary / .Secondary slots that pin actions to opposite ends.

// ② State — one field per control.
interface State {
  composition: "direct" | "slots";
  orientation: "horizontal" | "vertical";
  horizontalAlign: "start" | "end";
}

const INITIAL_STATE: State = {
  composition: "direct",
  orientation: "horizontal",
  horizontalAlign: "end",
};

// ③ Mirror exactly what the preview renders. horizontalAlign only applies when
//    horizontal, so it's omitted from the snippet in vertical orientation.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.orientation !== "horizontal") attrs.push(`orientation="${s.orientation}"`);
  if (s.orientation === "horizontal" && s.horizontalAlign !== "end") {
    attrs.push(`horizontalAlign="${s.horizontalAlign}"`);
  }

  if (s.composition === "slots") {
    const open = attrs.length
      ? `<ButtonLayout.Root ${attrs.join(" ")}>`
      : "<ButtonLayout.Root>";
    return [
      open,
      "  <ButtonLayout.Primary>",
      "    <Button>Publish</Button>",
      "  </ButtonLayout.Primary>",
      "  <ButtonLayout.Secondary>",
      `    <Button variant="outline">Save draft</Button>`,
      `    <Button variant="secondary">Cancel</Button>`,
      "  </ButtonLayout.Secondary>",
      "</ButtonLayout.Root>",
    ].join("\n");
  }

  // Keep the outline button directly beside the primary (outline → primary last).
  const open = attrs.length ? `<ButtonLayout ${attrs.join(" ")}>` : "<ButtonLayout>";
  return [
    open,
    `  <Button variant="secondary">Cancel</Button>`,
    `  <Button variant="outline">Save draft</Button>`,
    `  <Button>Publish</Button>`,
    "</ButtonLayout>",
  ].join("\n");
}

const ButtonLayoutPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    {
      name: "composition",
      type: "select",
      options: ["direct", "slots"],
      description: "slots uses Primary / Secondary groups",
    },
    { name: "orientation", type: "select", options: ["horizontal", "vertical"] },
    {
      name: "horizontalAlign",
      type: "select",
      options: ["start", "end"],
      description: "Only applies when horizontal",
    },
  ];

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ⑤ Render the real ButtonLayout from state. Full-width host so alignment shows.
  const preview = (
    <div className="w-full">
      {state.composition === "slots" ? (
        <ButtonLayout.Root
          orientation={state.orientation}
          horizontalAlign={state.horizontalAlign}
        >
          <ButtonLayout.Primary>
            <Button>Publish</Button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <Button variant="outline">Save draft</Button>
            <Button variant="secondary">Cancel</Button>
          </ButtonLayout.Secondary>
        </ButtonLayout.Root>
      ) : (
        <ButtonLayout orientation={state.orientation} horizontalAlign={state.horizontalAlign}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="outline">Save draft</Button>
          <Button>Publish</Button>
        </ButtonLayout>
      )}
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

        {/* --- Control grid: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {controls.map(renderControl)}
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

export default ButtonLayoutPlayground;
