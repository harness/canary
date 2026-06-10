import { SplitPaneStepperCard } from './split-pane-stepper-card'
import { SplitPaneStepperCardAction } from './split-pane-stepper-card-action'
import { SplitPaneStepperDrawer } from './split-pane-stepper-drawer'
import { SplitPaneStepperRoot } from './split-pane-stepper-root'

export const SplitPaneStepper = {
  Root: SplitPaneStepperRoot,
  Card: SplitPaneStepperCard,
  CardAction: SplitPaneStepperCardAction,
  Drawer: SplitPaneStepperDrawer
}

export { useFlowCard } from './split-pane-stepper-context'

export type {
  FlowConfig,
  StepConfig,
  SubStepConfig,
  CardEntry,
  CardStatus,
  DrawerResult,
  DrawerComponentProps,
  DrawerRegistrationProps,
  FlowCardContext,
  SplitPaneStepperRootProps,
  CardActionProps
} from './split-pane-stepper-types'

export type { SplitPaneStepperCardProps } from './split-pane-stepper-card'