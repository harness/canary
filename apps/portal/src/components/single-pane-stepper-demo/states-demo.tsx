import { useEffect } from "react";

import {
  SinglePaneStepper,
  DualPaneStepper,
  TooltipProvider,
  LogoV2,
  useFlowCard,
  type FlowConfig,
} from "@harnessio/ui/components";

// Demo that renders every resolved substep state deterministically on load — completed, skipped, and
// errored substeps across two steps. Each card drives itself into its target state on mount (no
// clicks, no timers), so the flow settles immediately into a fixed, fully-resolved shape. Also the
// visual fixture for connector rendering across states (skip/error branches + terminal-trunk cap).

// Renders a short body (so completed cards read as real content), then completes on mount → `next`.
function CompleteOnMount({ next, body }: { next?: string; body: string }) {
  const { status, complete } = useFlowCard();
  useEffect(() => {
    if (status !== "active") return;
    complete({}, next);
  }, [status, complete, next]);
  return <div style={{ padding: "var(--cn-spacing-2) 0" }}>{body}</div>;
}

// Skips on mount → `next` (renders the skip arrow in the timeline).
function SkipOnMount({ next }: { next?: string }) {
  const { status, skip } = useFlowCard();
  useEffect(() => {
    if (status !== "active") return;
    skip(next);
  }, [status, skip, next]);
  return null;
}

// Errors on mount and advances to `next` (error-and-continue): the substep stays red in the timeline
// while the flow proceeds to the recovery substep below it.
function ErrorThenContinue({ next, body }: { next?: string; body: string }) {
  const { status, error } = useFlowCard();
  useEffect(() => {
    if (status !== "active") return;
    error(next);
  }, [status, error, next]);
  return <div style={{ padding: "var(--cn-spacing-2) 0" }}>{body}</div>;
}

// Step 1 (source): completed → skipped → completed.
const ChooseProvider = () => (
  <CompleteOnMount next="verify-connection" body="Connected to Harness Code." />
);
const VerifyConnection = () => <SkipOnMount next="select-repo" />;
const SelectRepo = () => (
  <CompleteOnMount
    next="provision"
    body="Selected repository: harness-hello-world."
  />
);
// Step 2 (verify): completed → error → completed.
const Provision = () => (
  <CompleteOnMount next="run-build" body="Provisioned the build environment." />
);
const RunBuild = () => (
  <ErrorThenContinue
    next="pipeline-ready"
    body="Build #1 failed — retried on a new runner."
  />
);
const PipelineReady = () => <CompleteOnMount body="Your pipeline is ready." />;

const statesFlow: FlowConfig = {
  steps: {
    source: {
      title: "Connect Source Code",
      description: "Connect Harness to your code",
    },
    verify: {
      title: "Verify",
      description: "Run and confirm everything works",
    },
  },
  subSteps: {
    // Step 1: completed, skipped, completed
    "choose-provider": {
      step: "source",
      title: "Choose code provider",
      component: ChooseProvider,
      next: "verify-connection",
    },
    "verify-connection": {
      step: "source",
      title: "Verify connection (skipped)",
      component: VerifyConnection,
      next: "select-repo",
    },
    "select-repo": {
      step: "source",
      title: "Select a repository",
      component: SelectRepo,
      next: "provision",
    },
    // Step 2: completed, error, completed
    provision: {
      step: "verify",
      title: "Provision environment",
      component: Provision,
      next: "run-build",
    },
    "run-build": {
      step: "verify",
      title: "Running first build (failed)",
      component: RunBuild,
      next: "pipeline-ready",
    },
    "pipeline-ready": {
      step: "verify",
      title: "Pipeline ready!",
      component: PipelineReady,
    },
  },
  initialSubStep: "choose-provider",
};

export interface StatesDemoProps {
  variant: "single" | "dual";
}

export function StatesDemo({ variant }: StatesDemoProps) {
  const isDual = variant === "dual";
  const Root = isDual ? DualPaneStepper.Root : SinglePaneStepper.Root;
  return (
    <div className="not-content h-full">
      <TooltipProvider>
        <Root
          flow={statesFlow}
          {...(isDual
            ? {
                icon: <LogoV2 name="harness" size="sm" />,
                title: "Create a CI pipeline",
                stepperTitle: "CI Onboarding",
              }
            : { showRootHeader: false })}
          contentTitle="Pipeline Configuration"
          contentSubtitle="Completed, skipped, and errored substeps across two steps"
          // Fully-resolved review flow: render from the top and don't chase the last card.
          disableAutoScroll
        />
      </TooltipProvider>
    </div>
  );
}
