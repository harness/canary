import { type FC, useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  CopyButton,
  DropdownMenu,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// An icon-only ButtonGroup: every button is iconOnly, so each carries a tooltip for
// accessibility. The controls shape the same buttonsProps array as the text group —
// count, orientation, size — plus whether the last button opens a dropdown.

const ICONS = ["info-circle", "key-back", "more-vert", "edit-pencil"];
const LABELS = ["Info", "Back", "More", "Edit"];

// ② State — one field per control.
interface State {
  orientation: "horizontal" | "vertical";
  size: "md" | "sm" | "xs";
  count: "2" | "3" | "4";
  lastDropdown: boolean;
}

const INITIAL_STATE: State = {
  orientation: "horizontal",
  size: "md",
  count: "3",
  lastDropdown: false,
};

// Sample dropdown content, shared by the preview and the generated snippet.
const DROPDOWN_CODE = `      dropdownProps: {
        content: (
          <>
            <DropdownMenu.Item title="Rename" />
            <DropdownMenu.Item title="Duplicate" />
            <DropdownMenu.Item title="Delete" />
          </>
        ),
      },`;

// ③ Mirror exactly what the preview renders.
function generateCode(s: State): string {
  const count = Number(s.count);
  const attrs: string[] = [];
  if (s.orientation !== "horizontal") attrs.push(`  orientation="${s.orientation}"`);
  if (s.size !== "md") attrs.push(`  size="${s.size}"`);

  const buttons = ICONS.slice(0, count).map((icon, i) => {
    const isLast = i === count - 1;
    const label = LABELS[i];
    if (isLast && s.lastDropdown) {
      return `    {\n      iconOnly: true,\n      children: <IconV2 name="${icon}" />,\n      tooltipProps: { content: '${label}' },\n${DROPDOWN_CODE}\n    },`;
    }
    return `    {\n      iconOnly: true,\n      children: <IconV2 name="${icon}" />,\n      tooltipProps: { content: '${label}' },\n    },`;
  });

  return [
    "<ButtonGroup",
    ...attrs,
    "  buttonsProps={[",
    ...buttons,
    "  ]}",
    "/>",
  ].join("\n");
}

const IconButtonGroupPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "orientation", type: "select", options: ["horizontal", "vertical"] },
    { name: "size", type: "select", options: ["md", "sm", "xs"] },
    { name: "count", type: "select", options: ["2", "3", "4"], description: "Number of buttons" },
    {
      name: "lastDropdown",
      type: "boolean",
      description: "Last button opens a dropdown menu",
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

  // ⑤ Render the real ButtonGroup from state, mirroring generateCode exactly.
  const count = Number(state.count);
  const buttonsProps = ICONS.slice(0, count).map((icon, i) => {
    const isLast = i === count - 1;
    const label = LABELS[i];
    const base = {
      iconOnly: true as const,
      children: <IconV2 name={icon} />,
      tooltipProps: { content: label },
    };
    if (isLast && state.lastDropdown) {
      return {
        ...base,
        dropdownProps: {
          content: (
            <>
              <DropdownMenu.Item title="Rename" />
              <DropdownMenu.Item title="Duplicate" />
              <DropdownMenu.Item title="Delete" />
            </>
          ),
        },
      };
    }
    return base;
  });

  const preview = (
    <ButtonGroup orientation={state.orientation} size={state.size} buttonsProps={buttonsProps} />
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

export default IconButtonGroupPlayground;
