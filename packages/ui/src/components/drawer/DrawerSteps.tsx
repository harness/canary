import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { Stepper } from '../stepper'
import { DrawerRailShell } from './DrawerRailShell'

export type DrawerStepsProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  value: string
  onValueChange?: (value: string) => void
  'aria-label'?: string
  title?: ReactNode
  children: ReactNode
}

// Drawer.Steps is a thin drawer-chrome wrapper around the design-system Stepper: the rail shell
// supplies the pane width, scroll body, and scroll-shadow header (with the optional title), while
// Stepper.Root owns the step list and the entire value-driven state engine (active/completed/
// upcoming derivation, furthest-reached navigation, keyboard nav, aria-live). Drawer.Step and
// Drawer.SubStep map onto Stepper.StepGroup / nested Stepper.Step. The title lives on the rail
// header, so it is intentionally NOT forwarded to Stepper.Root (which would render a second header).
const noop = () => {}

export const DrawerSteps = forwardRef<HTMLElement, DrawerStepsProps>(
  ({ className, value, onValueChange, children, title, 'aria-label': ariaLabel = 'Drawer steps', ...props }, ref) => (
    <DrawerRailShell ref={ref} as="nav" className={className} title={title} aria-label={ariaLabel} {...props}>
      <Stepper.Root value={value} onValueChange={onValueChange ?? noop}>
        {children}
      </Stepper.Root>
    </DrawerRailShell>
  )
)
DrawerSteps.displayName = 'DrawerSteps'
