import type { ReactNode } from "react";
import { DualPaneStepper } from "@harnessio/ui/components";

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
    <DualPaneStepper.Card title={title} description={description}>
      {children}
    </DualPaneStepper.Card>
  );
}
