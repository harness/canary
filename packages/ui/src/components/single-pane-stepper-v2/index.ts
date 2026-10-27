import { FlowStepperCardAction } from '../flow-stepper/flow-stepper-card-action'
import { SinglePaneStepperV2Card } from './single-pane-stepper-v2-card'
import { SinglePaneStepperV2Root } from './single-pane-stepper-v2-root'

export const SinglePaneStepperV2 = {
  Root: SinglePaneStepperV2Root,
  Card: SinglePaneStepperV2Card,
  CardAction: FlowStepperCardAction
}

export type { SinglePaneStepperV2RootProps, SinglePaneStepperV2CardProps } from './single-pane-stepper-v2-types'
