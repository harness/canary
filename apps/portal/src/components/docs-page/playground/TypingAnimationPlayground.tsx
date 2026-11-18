import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  TooltipProvider,
  TypingAnimation,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// TypingAnimation is a simple prop-driven component: it reveals `text` one
// character at a time, then stays fully shown. The animation plays ONCE per
// mount (an internal ref guards it), so the preview is keyed on the settings
// plus a replay nonce — changing any control replays the effect, and the
// Replay button re-runs it with the current settings. Since it extends Text,
// the typography props (variant / color / align) are exposed too.

// Component defaults — the generated snippet omits props left at these values.
const DEFAULT_SPEED = 50;
const DEFAULT_DELAY = 0;
const DEFAULT_VARIANT = "body-normal";
const DEFAULT_COLOR = "foreground-2";
const DEFAULT_ALIGN = "left";

// Curated subsets of the inherited Text options — enough to show the spread
// without an overwhelming list.
const VARIANTS = [
  "heading-hero",
  "heading-section",
  "heading-base",
  "body-normal",
  "body-strong",
  "body-code",
  "caption-normal",
  "caption-strong",
];

const COLORS = [
  "foreground-1",
  "foreground-2",
  "foreground-3",
  "success",
  "warning",
  "danger",
  "brand",
];

// ① State — one field per control.
interface State {
  text: string;
  typingSpeed: number;
  delay: number;
  variant: string;
  color: string;
  align: string;
}

const INITIAL_STATE: State = {
  text: "Hello! How can I help you today?",
  typingSpeed: DEFAULT_SPEED,
  delay: DEFAULT_DELAY,
  variant: DEFAULT_VARIANT,
  color: DEFAULT_COLOR,
  align: DEFAULT_ALIGN,
};

// ② Mirror exactly what the preview renders, emitting props only when they
//    differ from the component defaults.
function generateCode(s: State): string {
  const attrs = [`text="${s.text}"`];
  if (s.typingSpeed !== DEFAULT_SPEED)
    attrs.push(`typingSpeed={${s.typingSpeed}}`);
  if (s.delay !== DEFAULT_DELAY) attrs.push(`delay={${s.delay}}`);
  if (s.variant !== DEFAULT_VARIANT) attrs.push(`variant="${s.variant}"`);
  if (s.color !== DEFAULT_COLOR) attrs.push(`color="${s.color}"`);
  if (s.align !== DEFAULT_ALIGN) attrs.push(`align="${s.align}"`);

  if (attrs.length === 1) return `<TypingAnimation ${attrs[0]} />`;
  return `<TypingAnimation\n${attrs.map((a) => `  ${a}`).join("\n")}\n/>`;
}

const TypingAnimationPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // Bumped by the Replay button to re-run the animation without changing settings.
  const [replayNonce, setReplayNonce] = useState(0);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);
  const replay = () => setReplayNonce((n) => n + 1);

  // ③ The curated control set — the component's own props plus the inherited
  //    Text typography props.
  const controls: PropControl[] = [
    {
      name: "text",
      type: "text",
      required: true,
      placeholder: "Text to type out",
      description: "The string revealed one character at a time",
    },
    {
      name: "typingSpeed",
      type: "number",
      description: "Milliseconds between each character",
    },
    {
      name: "delay",
      type: "number",
      description: "Milliseconds to wait before typing starts",
    },
    {
      name: "variant",
      type: "select",
      options: VARIANTS,
      description: "Typography variant (inherited from Text)",
    },
    {
      name: "color",
      type: "select",
      options: COLORS,
      description: "Text color (inherited from Text)",
    },
    {
      name: "align",
      type: "select",
      options: ["left", "center", "right"],
      description: "Text alignment",
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

  // ④ The animation plays once per mount, so remount whenever the settings or
  //    the replay nonce change — that re-runs the reveal for immediate feedback.
  const replayKey = `${replayNonce}|${state.text}|${state.typingSpeed}|${state.delay}|${state.variant}|${state.color}|${state.align}`;

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex min-h-[140px] items-center justify-center p-cn-3xl">
          <div className="absolute right-cn-sm top-cn-sm z-10 flex gap-cn-2xs">
            <Button
              variant="outline"
              size="sm"
              iconOnly
              onClick={replay}
              tooltipProps={{ content: "Replay animation" }}
            >
              <IconV2 name="play" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconOnly
              onClick={reset}
              tooltipProps={{ content: "Reset to defaults" }}
            >
              <IconV2 name="refresh" />
            </Button>
          </div>

          <div className="w-[520px] max-w-full">
            <TypingAnimation
              key={replayKey}
              text={state.text}
              typingSpeed={state.typingSpeed}
              delay={state.delay}
              variant={state.variant as never}
              color={state.color as never}
              align={state.align as never}
            />
          </div>
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

export default TypingAnimationPlayground;
