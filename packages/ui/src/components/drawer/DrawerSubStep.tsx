import { ReactNode } from 'react'

import { Stepper } from '../stepper'
import { useParentStep } from '../stepper/stepper-context'

export type DrawerSubStepProps = {
  value: string
  title: ReactNode
}

// A drawer substep is a nested Stepper.Step: rendered inside a Drawer.Step (Stepper.StepGroup), the
// group's ParentStepProvider makes Stepper.Step register as a nested step and derive its state
// (completed/active/upcoming) from the shared value. We keep the drawer's guard that a SubStep must
// live inside a Step — without a parent group Stepper.Step would silently render as a top-level step
// instead of throwing.
export const DrawerSubStep = ({ value, title }: DrawerSubStepProps) => {
  const parentValue = useParentStep()

  if (parentValue === null) {
    throw new Error('Drawer.SubStep must be used inside a Drawer.Step')
  }

  return <Stepper.Step value={value} title={title} />
}
DrawerSubStep.displayName = 'DrawerSubStep'
