import { type ComponentType, type ReactNode } from 'react'

import {
  type DrawerComponentProps,
  type FlowConfig,
  type ReactivationPrompt
} from '../flow-stepper/engine/engine-types'

export type {
  StepGroupConfig,
  StepConfig,
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
  // Disable auto-scrolling the right pane to the active card (on mount and on transitions). Use for
  // completed/review flows where the card stack should render from the top and stay put.
  disableAutoScroll?: boolean
  panelSizes?: { default?: number; min?: number; max?: number }
  /** Grouped-mode only: omit groups whose derived state is `upcoming`. Visited and active groups
   *  still render. No-op on flat flows. Applies to the default left pane only. Visual only — engine
   *  derivation, routing, and badge totals are unchanged. Default false. */
  hideUpcomingGroups?: boolean
  /** Omit predicted nested-step placeholders in grouped mode, and upcoming entries from the flat
   *  timeline. Applies to the default left pane only. Visual only — engine derivation, routing,
   *  badge totals, and the indeterminate placeholder still follow the engine. Default false. */
  hidePredictedSteps?: boolean
}

// CardAction props come from the shared FlowStepperCardAction (single source of truth).
export type { FlowStepperCardActionProps as CardActionProps } from '../flow-stepper/flow-stepper-card-action'
