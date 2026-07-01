import type { ReactNode } from "react";
import { DualPaneStepper, useFlowCard } from "@harnessio/ui/components";

interface OnboardingInputCardProps {
  title: string;
  description?: string;
  completedSummary?: ReactNode;
  children: ReactNode;
}

export function OnboardingInputCard({
  title,
  description,
  completedSummary,
  children,
}: OnboardingInputCardProps) {
  const { status } = useFlowCard();
  const isCompleted = status === "completed" || status === "skipped";

  return (
    <DualPaneStepper.Card title={title} description={description}>
      {isCompleted && completedSummary ? completedSummary : children}
    </DualPaneStepper.Card>
  );
}
