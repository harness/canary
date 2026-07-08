import { FlowStepperCard } from '../flow-stepper/flow-stepper-card'
import { FlowStepperCardAction } from '../flow-stepper/flow-stepper-card-action'
import { DualPaneStepperRoot } from './dual-pane-stepper-root'

export const DualPaneStepper = {
  Root: DualPaneStepperRoot,
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
  DualPaneStepperRootProps,
  CardActionProps
} from './dual-pane-stepper-types'

export type { FlowStepperCardProps as DualPaneStepperCardProps } from '../flow-stepper/flow-stepper-card'
