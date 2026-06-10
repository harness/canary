import { SplitPaneStepper, TooltipProvider } from "@harnessio/ui/components";
import { fullFlow, MockConfigDrawer } from ".";

export function FullFlowDemo() {
  return (
    <div className="not-content h-full">
      <TooltipProvider>
        <SplitPaneStepper.Root
          flow={fullFlow}
          title="Create a CI pipeline"
          stepperTitle="CI Onboarding"
          contentTitle="Pipeline Configuration"
          subtitle="Connect your code, configure infrastructure, and create your first CI pipeline"
        >
          <SplitPaneStepper.Drawer id="config" component={MockConfigDrawer} />
        </SplitPaneStepper.Root>
      </TooltipProvider>
    </div>
  );
}