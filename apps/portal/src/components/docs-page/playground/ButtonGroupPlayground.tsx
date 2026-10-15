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

// ButtonGroup is data-driven (buttonsProps is an array of button configs). The
// only control here toggles whether the last button opens a dropdown instead of
// firing a direct action.

const LABELS = ["First", "Second", "Third"];

// ② State — one field per control.
interface State {
  lastDropdown: boolean;
}

const INITIAL_STATE: State = {
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
  const buttons = LABELS.map((label, i) => {
    const isLast = i === LABELS.length - 1;
    if (isLast && s.lastDropdown) {
      return `    {\n      children: '${label}',\n${DROPDOWN_CODE}\n    },`;
    }
    return `    { children: '${label}', onClick: () => {} },`;
  });

  return ["<ButtonGroup", "  buttonsProps={[", ...buttons, "  ]}", "/>"].join("\n");
}

const ButtonGroupPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    {
      name: "lastDropdown",
      type: "boolean",
      description: "Last button opens a dropdown menu",
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

  // ⑤ Render the real ButtonGroup from state, mirroring generateCode exactly.
  const buttonsProps = LABELS.map((label, i) => {
    const isLast = i === LABELS.length - 1;
    if (isLast && state.lastDropdown) {
      return {
        children: label,
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
    return { children: label, onClick: () => {} };
  });

  const preview = <ButtonGroup buttonsProps={buttonsProps} />;

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

export default ButtonGroupPlayground;
