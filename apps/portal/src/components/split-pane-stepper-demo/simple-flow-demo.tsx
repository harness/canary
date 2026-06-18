import {
  LogoV2,
  SplitPaneStepper,
  TooltipProvider,
} from "@harnessio/ui/components";
import { fullFlow, MockConfigDrawer } from ".";

export function SimpleFlowDemo() {
  return (
    <TooltipProvider>
      <SplitPaneStepper.Root
        flow={fullFlow}
        icon={<LogoV2 name="harness" size="sm" />}
        title="Create a build pipeline"
        contentSubtitle="Harness will analyze your codebase and generate a CI pipeline."
        drawers={{ config: MockConfigDrawer }}
      />
    </TooltipProvider>
  );
}
