import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Text,
  Toaster,
  toast,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// `toast` is an imperative API, not a rendered component, so the preview is a
// trigger button that fires the configured toast and a <Toaster> mounted inside
// the card to render it. The `type` control picks which function to call
// (toast / toast.success / .danger / .info / .loading / .promise); the remaining
// controls map to the params and `options`, and we only surface the ones each
// type actually supports (loading/promise have no description or duration; the
// secondaryAction / ctaPosition / severity options are info-only).
const ACTION = { label: "Undo", onClick: () => {} };
const SECONDARY_ACTION = { label: "Dismiss", onClick: () => {} };

// Playground-only: loading toasts have no close button and never auto-close, so
// we dismiss them on a timer to avoid leaving a stuck toast on the page. Real
// callers close a loading toast with toast.dismiss(id), so this is intentionally
// kept out of generateCode.
const PLAYGROUND_LOADING_DISMISS_MS = 4000;

type ToastType =
  | "default"
  | "success"
  | "danger"
  | "info"
  | "loading"
  | "promise";

interface State {
  type: ToastType;
  title: string;
  description: string;
  duration: number; // 0 = use the component default (10s)
  dismissible: boolean;
  action: boolean;
  secondaryAction: boolean; // info only
  ctaPosition: "top" | "bottom"; // info only
  severity: "none" | "Critical" | "High" | "Medium" | "Low"; // info only
}

const INITIAL_STATE: State = {
  type: "default",
  title: "Changes saved",
  description: "Your changes have been saved successfully.",
  duration: 0,
  dismissible: true,
  action: false,
  secondaryAction: false,
  ctaPosition: "top",
  severity: "none",
};

// Mirror what fire() does, emitting only params/options that differ from the
// defaults. Promise toasts have a distinct call signature, so they branch early.
function generateCode(s: State): string {
  const title = s.title || "Toast title";

  if (s.type === "promise") {
    const opts: string[] = [];
    if (s.action) opts.push(`action: { label: "Undo", onClick: () => {} }`);
    if (!s.dismissible) opts.push(`dismissible: false`);
    const optionsBlock = opts.length
      ? `,\n  options: {\n    ${opts.join(",\n    ")}\n  }`
      : "";
    return `toast.promise(myPromise, {
  loadingMessage: "${title}",
  successMessage: "Done!",
  errorMessage: "Something went wrong"${optionsBlock}
})`;
  }

  const opts: string[] = [];
  if (s.type !== "loading" && s.duration > 0)
    opts.push(`duration: ${s.duration}`);
  if (s.type !== "loading" && !s.dismissible) opts.push(`dismissible: false`);
  if (s.action) opts.push(`action: { label: "Undo", onClick: () => {} }`);
  if (s.type === "info") {
    if (s.secondaryAction)
      opts.push(`secondaryAction: { label: "Dismiss", onClick: () => {} }`);
    if (s.ctaPosition !== "top") opts.push(`ctaPosition: "${s.ctaPosition}"`);
    if (s.severity !== "none") opts.push(`severity: "${s.severity}"`);
  }

  const params: string[] = [`title: "${title}"`];
  if (s.type !== "loading" && s.description)
    params.push(`description: "${s.description}"`);
  if (opts.length) params.push(`options: {\n    ${opts.join(",\n    ")}\n  }`);

  const fn = s.type === "default" ? "toast" : `toast.${s.type}`;
  return `${fn}({\n  ${params.join(",\n  ")}\n})`;
}

const ToastPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // Fire the configured toast. Build each type's params/options to match
  // generateCode exactly, so the snippet never lies about what ran.
  const fire = () => {
    const title = state.title || "Toast title";
    const description = state.description || undefined;

    if (state.type === "promise") {
      toast.promise(
        new Promise((resolve, reject) => {
          window.setTimeout(
            () =>
              Math.random() > 0.5
                ? resolve("ok")
                : reject(new Error("rejected")),
            2500,
          );
        }),
        {
          loadingMessage: title,
          successMessage: "Done!",
          errorMessage: "Something went wrong",
          options: {
            ...(state.action ? { action: ACTION } : {}),
            ...(state.dismissible ? {} : { dismissible: false }),
          },
        },
      );
      return;
    }

    if (state.type === "loading") {
      const id = toast.loading({
        title,
        options: state.action ? { action: ACTION } : {},
      });
      // Playground-only safety timer so the un-dismissable loading toast clears
      // itself (see PLAYGROUND_LOADING_DISMISS_MS). Not reflected in the snippet.
      window.setTimeout(() => toast.dismiss(id), PLAYGROUND_LOADING_DISMISS_MS);
      return;
    }

    const base = {
      ...(state.duration > 0 ? { duration: state.duration } : {}),
      dismissible: state.dismissible,
      ...(state.action ? { action: ACTION } : {}),
    };

    if (state.type === "info") {
      toast.info({
        title,
        description,
        options: {
          ...base,
          ...(state.secondaryAction
            ? { secondaryAction: SECONDARY_ACTION }
            : {}),
          ctaPosition: state.ctaPosition,
          ...(state.severity !== "none" ? { severity: state.severity } : {}),
        },
      });
      return;
    }

    if (state.type === "success")
      toast.success({ title, description, options: base });
    else if (state.type === "danger")
      toast.danger({ title, description, options: base });
    else toast({ title, description, options: base });
  };

  // Surface only the controls each type actually honors.
  const controls: PropControl[] = [
    {
      name: "type",
      type: "select",
      options: ["default", "success", "danger", "info", "loading", "promise"],
      description: "Which toast function to call",
    },
    {
      name: "title",
      type: "text",
      required: true,
      description:
        state.type === "promise"
          ? "Shown while the promise is pending (loadingMessage)"
          : "Bold heading of the toast",
    },
  ];

  const supportsBody = state.type !== "loading" && state.type !== "promise";
  if (supportsBody) {
    controls.push({
      name: "description",
      type: "text",
      description: "Secondary line (empty hides it)",
    });
    controls.push({
      name: "duration",
      type: "number",
      description: "Auto-close delay in ms (0 = default 10s)",
    });
  }

  controls.push({
    name: "action",
    type: "boolean",
    description: "Add an action button",
  });
  if (state.type !== "loading") {
    controls.push({
      name: "dismissible",
      type: "boolean",
      description: "Show a close button",
    });
  }
  if (state.type === "info") {
    controls.push({
      name: "secondaryAction",
      type: "boolean",
      description: "Add a second action button",
    });
    controls.push({
      name: "ctaPosition",
      type: "select",
      options: ["top", "bottom"],
      description: "Where the action buttons sit",
    });
    controls.push({
      name: "severity",
      type: "select",
      options: ["none", "Critical", "High", "Medium", "Low"],
      description: "Colored left-border indicator",
    });
  }

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

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the trigger fires a toast into the mounted Toaster --- */}
        <div className="bg-cn-2 relative flex min-h-[120px] flex-col items-center justify-center gap-cn-xs p-cn-3xl">
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

          <Button onClick={fire}>Show toast</Button>
          <Text variant="caption-normal" color="foreground-3">
            {state.type === "loading"
              ? "Fires a loading toast — auto-dismissed after a few seconds (playground only)"
              : `Fires a ${state.type} toast — it appears in the corner of the screen`}
          </Text>
          <Toaster className="not-content" />
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

export default ToastPlayground;
