import type { ReactNode } from "react";
import { SplitPaneStepper } from "@harnessio/ui/components";

interface OnboardingOutputCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function OnboardingOutputCard({
  title,
  description,
  children,
}: OnboardingOutputCardProps) {
  return (
    <SplitPaneStepper.Card title={title} description={description}>
      {children}
    </SplitPaneStepper.Card>
  );
}