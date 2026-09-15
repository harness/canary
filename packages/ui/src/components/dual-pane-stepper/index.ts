import { FlowStepperCard } from '../flow-stepper/flow-stepper-card'
import { FlowStepperCardAction } from '../flow-stepper/flow-stepper-card-action'
import { DualPaneStepperRoot } from './dual-pane-stepper-root'

export const DualPaneStepper = {
  Root: DualPaneStepperRoot,
  Card: FlowStepperCard,
  CardAction: FlowStepperCardAction
}

export { useFlowCard } from '../flow-stepper/engine/engine-context'

export {
  isGroupedFlowConfig,
  isFlatFlowConfig,
  isGroupedStepConfig,
  isFlatStepConfig
} from '../flow-stepper/engine/engine-types'

export type {
  FlowConfig,
  GroupedFlowConfig,
  FlatFlowConfig,
  StepGroupConfig,
  StepConfig,
  CardStatus,
  DrawerResult,
  DrawerComponentProps,
  FlowCardContext,
  DualPaneStepperRootProps,
  CardActionProps
} from './dual-pane-stepper-types'

export type { FlowStepperCardProps as DualPaneStepperCardProps } from '../flow-stepper/flow-stepper-card'
