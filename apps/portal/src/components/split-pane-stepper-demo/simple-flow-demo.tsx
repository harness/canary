import { SplitPaneStepper, TooltipProvider } from "@harnessio/ui/components";
import { fullFlow, MockConfigDrawer } from ".";

export function SimpleFlowDemo() {
  return (
    <TooltipProvider>
      <SplitPaneStepper.Root
        flow={fullFlow}
        title="Create a build pipeline"
        subtitle="Harness will analyze your codebase and generate a CI pipeline."
      >
        <SplitPaneStepper.Drawer id="config" component={MockConfigDrawer} />
      </SplitPaneStepper.Root>
    </TooltipProvider>
  );
}
