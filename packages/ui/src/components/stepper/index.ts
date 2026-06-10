import { StepperRoot } from './stepper'
import { StepperStep } from './stepper-step'
import { StepperSubStep } from './stepper-sub-step'

export const Stepper = {
  Root: StepperRoot,
  Step: StepperStep,
  SubStep: StepperSubStep
}

export type { StepperProps, StepperStepProps, StepperSubStepProps, StepState } from './stepper-types'
