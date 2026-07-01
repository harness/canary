import {
  LogoV2,
  DualPaneStepper,
  TooltipProvider,
} from "@harnessio/ui/components";
import { fullFlow, MockConfigDrawer } from ".";

export function FullFlowDemo() {
  return (
    <div className="not-content h-full">
      <TooltipProvider>
        <DualPaneStepper.Root
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
