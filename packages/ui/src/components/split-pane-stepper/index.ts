import { SplitPaneStepperCard } from './split-pane-stepper-card'
import { SplitPaneStepperCardAction } from './split-pane-stepper-card-action'
import { SplitPaneStepperRoot } from './split-pane-stepper-root'

export const SplitPaneStepper = {
  Root: SplitPaneStepperRoot,
  Card: SplitPaneStepperCard,
  CardAction: SplitPaneStepperCardAction
}

export { useFlowCard } from './split-pane-stepper-context'

export type {
  FlowConfig,
  StepConfig,
  SubStepConfig,
  CardStatus,
  DrawerResult,
  DrawerComponentProps,
  FlowCardContext,
  SplitPaneStepperRootProps,
  CardActionProps
} from './split-pane-stepper-types'

export type { SplitPaneStepperCardProps } from './split-pane-stepper-card'
