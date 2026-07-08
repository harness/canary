import {
  SinglePaneStepper,
  TooltipProvider,
  LogoV2,
} from "@harnessio/ui/components";
import { fullFlow, MockConfigDrawer } from "../dual-pane-stepper-demo";

// Intentionally a drop-in mirror of the dual-pane demo (FullFlowDemo): same flow,
// same drawers, same props — only the stepper element differs (SinglePaneStepper.Root
// vs DualPaneStepper.Root). The two are meant to be interchangeable.
export function FullFlowDemo() {
  return (
    // Mirror the dual-pane demo wrapper exactly (.not-content h-full): the stepper fills the
    // MDX-provided bounded height so its card stack clips and scrolls internally, and both
    // demos render at the same size for side-by-side comparison. .not-content also opts out
    // of Starlight's docs-prose margins.
    <div className="not-content h-full">
      <TooltipProvider>
        <SinglePaneStepper.Root
          flow={fullFlow}
          icon={<LogoV2 name="harness" size="sm" />}
          title="Create a CI pipeline"
          stepperTitle="CI Onboarding"
          contentTitle="Pipeline Configuration"
          contentSubtitle="Connect your code, configure infrastructure, and create your first CI pipeline"
          drawers={{ config: MockConfigDrawer }}
        />
      </TooltipProvider>
    </div>
  );
}
