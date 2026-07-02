import { FlowStepperCard } from '../flow-stepper/flow-stepper-card'
import { FlowStepperCardAction } from '../flow-stepper/flow-stepper-card-action'
import { SinglePaneStepperRoot } from './single-pane-stepper-root'

export const SinglePaneStepper = {
  Root: SinglePaneStepperRoot,
  Card: FlowStepperCard,
  CardAction: FlowStepperCardAction
}

export { useFlowCard } from '../flow-stepper/engine/engine-context'

export type {
  FlowConfig,
  StepConfig,
  SubStepConfig,
  CardStatus,
  DrawerResult,
  DrawerComponentProps,
  FlowCardContext,
  SinglePaneStepperRootProps,
  CardActionProps
} from './single-pane-stepper-types'

export type { FlowStepperCardProps as SinglePaneStepperCardProps } from '../flow-stepper/flow-stepper-card'
