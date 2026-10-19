import {
  type ChangeEvent,
  type ComponentProps,
  type FC,
  type FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Button,
  CopyButton,
  IconV2,
  PromptInput,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// PromptInput is a compound component for AI chat input — a <form> Root wrapping a
// Textarea and a Toolbar (Tools on the left, Submit on the right), with an optional
// removable Tags row. Its slots are composed JSX, so this is a bespoke playground:
// the controls toggle which parts are present and drive their props, and the preview
// renders the real composition.

// ① Sample content shared by BOTH the preview and the generated snippet so the two
//    never drift. Tag icons are verified IconV2 names.
type Tags = ComponentProps<typeof PromptInput.Tags>["tags"];
const SAMPLE_TAGS: Tags = [
  { id: "readme", displayName: "README.md", icon: "empty-page" },
  { id: "api", displayName: "api.ts", icon: "code-brackets" },
];

// ② The state shape — one field per control.
interface State {
  placeholder: string;
  value: string;
  showTools: boolean;
  streaming: boolean;
  showTags: boolean;
  disabled: boolean;
}

const INITIAL_STATE: State = {
  placeholder: "Ask me anything…",
  value: "",
  showTools: true,
  streaming: false,
  showTags: false,
  disabled: false,
};

// ③ Turn the current state into the JSX string shown in "Show code", mirroring the
//    preview exactly — same slots present, same props emitted.
function generateCode(s: State): string {
  const lines: string[] = ["<PromptInput.Root onSubmit={handleSubmit}>"];

  if (s.showTags)
    lines.push("  <PromptInput.Tags tags={tags} onRemove={handleRemove} />");

  const textarea = [`placeholder="${s.placeholder}"`];
  if (s.value) textarea.push(`value="${s.value}"`);
  if (s.disabled) textarea.push("disabled");
  lines.push(`  <PromptInput.Textarea ${textarea.join(" ")} />`);

  lines.push("  <PromptInput.Toolbar>");
  if (s.showTools) {
    lines.push("    <PromptInput.Tools>");
    lines.push(
      "      <PromptInput.Button prefixIcon=\"plus\" prefixIconProps={{ size: 'sm' }} tooltipProps={{ title: 'Add' }} />",
    );
    lines.push("    </PromptInput.Tools>");
  } else {
    lines.push("    <PromptInput.Tools />");
  }

  const submit: string[] = [];
  if (s.streaming) submit.push('status="streaming"');
  if (s.disabled) submit.push("disabled");
  lines.push(
    `    <PromptInput.Submit${submit.length ? " " + submit.join(" ") : ""} />`,
  );

  lines.push("  </PromptInput.Toolbar>");
  lines.push("</PromptInput.Root>");

  return lines.join("\n");
}

const PromptInputPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // Tags live outside the control state so the remove buttons work in the preview.
  const [tags, setTags] = useState<Tags>(SAMPLE_TAGS);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setTags(SAMPLE_TAGS);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "placeholder",
      type: "text",
      description: "Textarea placeholder text",
    },
    {
      name: "value",
      type: "text",
      description: "Pre-filled message — also editable in the preview",
    },
    {
      name: "showTools",
      type: "boolean",
      description: "Show a toolbar action button",
    },
    {
      name: "streaming",
      type: "boolean",
      description: 'Submit shows a stop icon (status="streaming")',
    },
    {
      name: "showTags",
      type: "boolean",
      description: "Show a row of removable context tags",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disable the textarea and submit",
    },
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the text controls.
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

  // ⑤ Render the real composition from state. Keep every condition aligned with
  //    generateCode so preview and snippet agree.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();
  const handleRemove = (id: string) =>
    setTags((prev) => prev.filter((t) => t.id !== id));

  const preview = (
    <div className="w-[370px]">
      <PromptInput.Root onSubmit={handleSubmit}>
        {state.showTags && (
          <PromptInput.Tags tags={tags} onRemove={handleRemove} />
        )}
        <PromptInput.Textarea
          placeholder={state.placeholder}
          value={state.value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            set("value", e.target.value)
          }
          disabled={state.disabled}
        />
        <PromptInput.Toolbar>
          <PromptInput.Tools>
            {state.showTools && (
              <PromptInput.Button
                prefixIcon="plus"
                prefixIconProps={{ size: "sm" }}
                tooltipProps={{ title: "Add" }}
              />
            )}
          </PromptInput.Tools>
          <PromptInput.Submit
            status={state.streaming ? "streaming" : undefined}
            disabled={state.disabled}
          />
        </PromptInput.Toolbar>
      </PromptInput.Root>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live composition; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[200px] items-center justify-center p-cn-3xl">
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

export default PromptInputPlayground;
