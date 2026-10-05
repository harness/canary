import { type FC, useMemo, useState } from "react";
import {
  Avatar,
  type AvatarProps,
  Button,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// A small, recognizable set of entity icons for the `icon` control. "none" is a
// sentinel for "no custom icon" (the prop is simply omitted).
const ICON_OPTIONS = [
  "none",
  "account",
  "organizations",
  "folder",
  "git-branch",
] as const;

// ② The state shape — one field per control.
interface State {
  size: "xs" | "sm" | "md" | "lg";
  name: string;
  src: string;
  icon: (typeof ICON_OPTIONS)[number];
  rounded: boolean;
  isGroup: boolean;
  noInitials: boolean;
}

// ② Defaults, hoisted so the reset button can reuse them. Opens on an initials
//    avatar (no src) at lg so the name, icon, and group controls all have a
//    visible effect out of the gate; rounded off shows the default square shape.
const INITIAL_STATE: State = {
  size: "lg",
  name: "John Doe",
  src: "",
  icon: "none",
  rounded: false,
  isGroup: false,
  noInitials: false,
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Only emit props that differ from the component defaults, and mirror exactly
//    what the preview renders.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.name) attrs.push(`name="${s.name}"`);
  if (s.src) attrs.push(`src="${s.src}"`);
  if (s.size !== "sm") attrs.push(`size="${s.size}"`); // default is sm
  if (s.icon !== "none") attrs.push(`icon="${s.icon}"`);
  if (s.rounded) attrs.push("rounded");
  if (s.isGroup) attrs.push("isGroup");
  if (s.noInitials) attrs.push("noInitials");

  return attrs.length ? `<Avatar ${attrs.join(" ")} />` : `<Avatar />`;
}

const AvatarPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  // `noInitials` is really about overflow counts, so toggling it swaps in a
  // "+22" example (and back to the person's name when off) to show the intent.
  const applyNoInitials = (noInitials: boolean) =>
    setState((prev) => ({
      ...prev,
      noInitials,
      name: noInitials ? "+22" : "John Doe",
    }));

  const reset = () => setState(INITIAL_STATE);

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "size",
      type: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "One of the four supported steps",
    },
    {
      name: "name",
      type: "text",
      description: "Supplies the image alt text and the initials fallback",
    },
    {
      name: "src",
      type: "text",
      description: "Image URL — when set it takes priority over the fallbacks",
    },
    {
      name: "icon",
      type: "select",
      options: [...ICON_OPTIONS],
      description: "A custom fallback icon (shown when there's no image)",
    },
    {
      name: "rounded",
      type: "boolean",
      description: "Circle instead of a rounded square",
    },
    {
      name: "isGroup",
      type: "boolean",
      description: "Group icon fallback (an icon overrides it)",
    },
    {
      name: "noInitials",
      type: "boolean",
      description: "Show the name as-is instead of initials — loads a +22 count",
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
        prop.name === "noInitials"
          ? applyNoInitials(v as boolean)
          : set(prop.name as keyof State, v as never)
      }
    />
  );

  // ⑤ Render the real component from state. Empty strings become undefined so
  //    the fallback chain (icon → group → initials → user icon) kicks in, and
  //    "none" maps to an omitted icon prop.
  const preview = (
    <Avatar
      name={state.name || undefined}
      src={state.src || undefined}
      size={state.size}
      rounded={state.rounded}
      isGroup={state.isGroup}
      noInitials={state.noInitials}
      icon={
        state.icon === "none" ? undefined : (state.icon as AvatarProps["icon"])
      }
    />
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

export default AvatarPlayground;
