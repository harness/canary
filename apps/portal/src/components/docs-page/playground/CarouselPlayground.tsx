import { type FC, useMemo, useState } from "react";
import { Button, Carousel, CopyButton, IconV2, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Carousel is a compound component that builds an Embla instance on Carousel.Root and
// shares it with the other parts through context — Content/Item/Previous/Next only work
// inside it. The generic schema can't express that (or the slides, which are ReactNode),
// so this is a bespoke playground: the controls drive Root's orientation plus the slide
// count and Embla's loop option, and the preview composes the real Carousel parts.

// ① The slide palette, shared by BOTH the preview and the generated snippet so they
//    never drift. Slides cycle through these colors.
const SLIDE_COLORS = ["bg-cn-blue-primary", "bg-cn-success-primary", "bg-cn-danger-primary"];
const slideClass = (i: number) =>
  `h-48 w-full ${SLIDE_COLORS[i % SLIDE_COLORS.length]} text-cn-1 flex items-center justify-center`;

// ② State — one field per control.
interface State {
  orientation: "horizontal" | "vertical";
  slides: string;
  loop: boolean;
}

const INITIAL_STATE: State = {
  orientation: "horizontal",
  slides: "3",
  loop: false,
};

// The slide count is offered as a select, so values arrive as strings.
const SLIDE_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];

// Keep the count sane — Embla needs at least one slide, and the preview stays readable
// below a handful.
const clampSlides = (n: number) => Math.max(1, Math.min(8, Math.floor(n) || 1));

// ③ Mirror exactly what the preview renders. Emit a prop only when it differs from its
//    default, so the snippet stays as short as the configuration allows.
function generateCode(s: State): string {
  const count = clampSlides(Number(s.slides));
  const rootAttrs: string[] = [];
  if (s.orientation !== "horizontal") rootAttrs.push(`orientation="${s.orientation}"`);
  if (s.loop) rootAttrs.push("opts={{ loop: true }}");
  rootAttrs.push(`className="w-full"`);

  // Vertical carousels need a fixed height on the viewport so it clips to one slide.
  const contentAttr = s.orientation === "vertical" ? ` carouselBlockClassName="h-48"` : "";

  const items = Array.from({ length: count }, (_, i) => {
    return `    <Carousel.Item>
      <div className="${slideClass(i)}">Slide ${i + 1}</div>
    </Carousel.Item>`;
  }).join("\n");

  return `<Carousel.Root ${rootAttrs.join(" ")}>
  <Carousel.Previous />
  <Carousel.Content${contentAttr}>
${items}
  </Carousel.Content>
  <Carousel.Next />
</Carousel.Root>`;
}

const CarouselPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "orientation", type: "select", options: ["horizontal", "vertical"] },
    { name: "slides", type: "select", options: SLIDE_OPTIONS, description: "Number of slides" },
    { name: "loop", type: "boolean", description: "Embla loop option (opts={{ loop: true }})" },
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

  // ⑤ Render the real Carousel from state, mirroring generateCode exactly. The nav
  //    buttons sit ~48px outside the viewport, so the stage gets padding on the axis
  //    being scrolled to keep them in view. Embla re-inits automatically when the slide
  //    count, orientation (axis), or loop option changes, keeping the key stable.
  const count = clampSlides(Number(state.slides));
  const items = Array.from({ length: count }, (_, i) => (
    <Carousel.Item key={i}>
      <div className={slideClass(i)}>Slide {i + 1}</div>
    </Carousel.Item>
  ));

  const preview = (
    <div
      className={
        state.orientation === "vertical" ? "w-[260px] py-[52px]" : "w-[260px] px-[52px]"
      }
    >
      <Carousel.Root
        orientation={state.orientation}
        opts={state.loop ? { loop: true } : undefined}
        className="w-full"
      >
        <Carousel.Previous />
        <Carousel.Content carouselBlockClassName={state.orientation === "vertical" ? "h-48" : undefined}>
          {items}
        </Carousel.Content>
        <Carousel.Next />
      </Carousel.Root>
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

export default CarouselPlayground;
