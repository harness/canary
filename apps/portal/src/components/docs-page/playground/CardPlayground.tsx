import { type FC, useMemo, useState } from "react";
import {
  Button,
  Card,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Card is a compound component (Root + Image + Title + Content). Its interesting props
// are layout variants on Root, and whether an image is present at all — things the
// generic schema can't express because it renders the composed children itself. So this
// is a bespoke playground: the controls drive Root's variants plus an "image" toggle,
// and the preview composes the real Card parts.

// ① Sample content shared by BOTH the preview and the generated snippet.
const SAMPLE_IMAGE = "/card-image.png";
const SAMPLE_TITLE = "Card title";
const SAMPLE_CONTENT = "A short supporting line that sits beneath the title.";

// ② State — one field per control.
interface State {
  size: "sm" | "md" | "lg";
  orientation: "vertical" | "horizontal";
  position: "start" | "end";
  image: boolean;
  selected: boolean;
  disabled: boolean;
  interactive: boolean;
}

const INITIAL_STATE: State = {
  size: "md",
  orientation: "vertical",
  position: "start",
  image: false,
  selected: false,
  disabled: false,
  interactive: true,
};

// ③ Mirror exactly what the preview renders. Emit a variant only when it differs from
//    its default, so the snippet stays as short as the configuration allows.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.orientation !== "vertical")
    attrs.push(`orientation="${s.orientation}"`);
  if (s.position !== "start") attrs.push(`position="${s.position}"`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.selected) attrs.push("selected");
  if (s.disabled) attrs.push("disabled");
  if (!s.interactive) attrs.push("interactive={false}");

  const open = attrs.length ? `<Card.Root ${attrs.join(" ")}>` : "<Card.Root>";
  const lines = [open];
  // Horizontal cards sit the image beside the content, so it needs a width or it eats
  // the whole row; vertical cards let the image fill the top edge.
  if (s.image) {
    const img =
      s.orientation === "horizontal"
        ? `  <Card.Image src="${SAMPLE_IMAGE}" alt="" width={160} />`
        : `  <Card.Image src="${SAMPLE_IMAGE}" alt="" />`;
    lines.push(img);
  }
  lines.push(`  <Card.Title>${SAMPLE_TITLE}</Card.Title>`);
  lines.push(`  <Card.Content>${SAMPLE_CONTENT}</Card.Content>`);
  lines.push("</Card.Root>");
  return lines.join("\n");
}

const CardPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "size", type: "select", options: ["sm", "md", "lg"] },
    {
      name: "orientation",
      type: "select",
      options: ["vertical", "horizontal"],
    },
    {
      name: "position",
      type: "select",
      options: ["start", "end"],
      description: "Image placement; needs an image to be visible",
    },
    { name: "image", type: "boolean", description: "Include a Card.Image" },
    { name: "selected", type: "boolean" },
    { name: "disabled", type: "boolean" },
    { name: "interactive", type: "boolean", description: "Hover styling" },
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

  // ⑤ Render the real Card from state, mirroring generateCode exactly. Horizontal
  //    cards need a little width to show the side-by-side layout, so the preview sits
  //    in a fixed-width (but responsive) wrapper.
  const preview = (
    <div className="w-[420px] max-w-full">
      <Card.Root
        size={state.size}
        orientation={state.orientation}
        position={state.position}
        selected={state.selected}
        disabled={state.disabled}
        interactive={state.interactive}
      >
        {state.image && (
          <Card.Image
            src={SAMPLE_IMAGE}
            alt=""
            width={state.orientation === "horizontal" ? 160 : undefined}
          />
        )}
        <Card.Title>{SAMPLE_TITLE}</Card.Title>
        <Card.Content>{SAMPLE_CONTENT}</Card.Content>
      </Card.Root>
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

export default CardPlayground;
