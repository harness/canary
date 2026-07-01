import { type ComponentType, type ReactNode } from 'react'

import {
  type DrawerComponentProps,
  type FlowConfig,
  type ReactivationPrompt
} from '../flow-stepper/engine/engine-types'

export type {
  StepConfig,
  SubStepConfig,
  FlowConfig,
  CardStatus,
  CardEntry,
  DrawerResult,
  DrawerComponentProps,
  FlowCardContext,
  ReactivationPrompt
} from '../flow-stepper/engine/engine-types'

export interface DualPaneStepperRootProps {
  flow: FlowConfig
  icon?: ReactNode
  title?: string
  stepperTitle?: string
  contentTitle?: string
  contentSubtitle?: string
  drawers?: Record<string, ComponentType<DrawerComponentProps>>
  onComplete?: (state: Record<string, unknown>) => void
  onClose?: () => void
  leftPane?: ReactNode
  reactivationPrompt?: ReactivationPrompt
  panelSizes?: { default?: number; min?: number; max?: number }
}

// CardAction props come from the shared FlowStepperCardAction (single source of truth).
export type { FlowStepperCardActionProps as CardActionProps } from '../flow-stepper/flow-stepper-card-action'
