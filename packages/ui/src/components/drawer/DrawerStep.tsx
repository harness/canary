import { ReactNode } from 'react'

import { Stepper } from '../stepper'

export type DrawerStepProps = {
  value: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

// A drawer step maps directly onto Stepper.StepGroup: the group provides the ParentStepProvider that
// Drawer.SubStep (a nested Stepper.Step) registers under, and the base Stepper derives this step's
// state (active/completed/upcoming) from the shared value — including treating the parent as active
// when one of its substeps is the active value. Substeps render only once the group is reached
// (progressive disclosure), matching the design-system stepper. `hasNestedSteps` is deliberately
// omitted: the drawer's substep list is fully declared, so we don't want the "…" predicted-step
// placeholder that flag turns on for PLG flows with unknown future steps.
export const DrawerStep = ({ value, title, description, children }: DrawerStepProps) => (
  <Stepper.StepGroup value={value} title={title} description={description}>
    {children}
  </Stepper.StepGroup>
)
DrawerStep.displayName = 'DrawerStep'
