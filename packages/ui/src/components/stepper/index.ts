import { StepperRoot } from './stepper'
import { StepperGroup } from './stepper-group'
import { StepperStep } from './stepper-step'

export const Stepper = {
  Root: StepperRoot,
  StepGroup: StepperGroup,
  Step: StepperStep
}

export { ParentStepProvider } from './stepper-context'
export type { StepperGroupProps, StepperProps, StepperStepProps, StepState } from './stepper-types'
