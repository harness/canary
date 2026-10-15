import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  NoData,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// NoData is a configuration-driven empty state: an optional illustration above a title and a
// description line, with optional primary/secondary actions. The playground drives the common
// props directly; the buttons are opt-in — a label turns each one on, matching how the
// component only renders an action when you pass it. (`description` is a string[] in the API;
// the playground keeps it to a single line.)
const IMAGE_OPTIONS = [
  "none",
  "no-data-cog",
  "no-data-folder",
  "no-search-magnifying-glass",
];

interface State {
  title: string;
  description: string;
  imageName: string;
  imageSize: number;
  primaryLabel: string;
  secondaryLabel: string;
  withBorder: boolean;
}

const INITIAL_STATE: State = {
  title: "No pipelines yet",
  description: "Create your first pipeline to get started.",
  imageName: "no-data-cog",
  imageSize: 112,
  primaryLabel: "Create pipeline",
  secondaryLabel: "Learn more",
  withBorder: true,
};

// Mirror the preview: emit the illustration/size only when set/non-default, always emit the
// required title + description, and add each button only when it has a label.
function generateCode(s: State): string {
  const lines = ["<NoData"];
  if (s.withBorder) lines.push("  withBorder");
  if (s.imageName !== "none") lines.push(`  imageName="${s.imageName}"`);
  if (s.imageSize !== 112) lines.push(`  imageSize={${s.imageSize}}`);
  lines.push(`  title="${s.title}"`);
  lines.push(`  description={['${s.description}']}`);
  if (s.primaryLabel)
    lines.push(`  primaryButton={{ label: '${s.primaryLabel}' }}`);
  if (s.secondaryLabel)
    lines.push(`  secondaryButton={{ label: '${s.secondaryLabel}' }}`);
  lines.push("/>");
  return lines.join("\n");
}

const NoDataPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    { name: "title", type: "text", description: "Empty-state heading" },
    {
      name: "description",
      type: "text",
      description: "Supporting line below the title",
    },
    {
      name: "imageName",
      type: "select",
      options: IMAGE_OPTIONS,
      description: "Illustration shown above the title",
    },
    {
      name: "imageSize",
      type: "number",
      description: "Illustration size in pixels",
    },
    {
      name: "primaryLabel",
      type: "text",
      description: "Primary action label (leave empty to omit)",
    },
    {
      name: "secondaryLabel",
      type: "text",
      description: "Secondary (outline) action label (leave empty to omit)",
    },
    {
      name: "withBorder",
      type: "boolean",
      description: "Wrap in a bordered, rounded container",
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

  const preview = (
    <div className="w-full max-w-md">
      <NoData
        withBorder={state.withBorder}
        imageName={
          state.imageName === "none" ? undefined : (state.imageName as never)
        }
        imageSize={state.imageSize}
        title={state.title}
        description={[state.description]}
        primaryButton={
          state.primaryLabel ? { label: state.primaryLabel } : undefined
        }
        secondaryButton={
          state.secondaryLabel ? { label: state.secondaryLabel } : undefined
        }
      />
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

export default NoDataPlayground;
