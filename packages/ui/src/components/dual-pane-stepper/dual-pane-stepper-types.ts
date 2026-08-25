import { type ComponentType, type CSSProperties, type ReactNode } from 'react'

import {
  type DrawerComponentProps,
  type FlowConfig,
  type InitialEngineState,
  type ReactivationPrompt
} from '../flow-stepper/engine/engine-types'

export type {
  StepGroupConfig,
  StepConfig,
  FlowConfig,
  GroupedFlowConfig,
  FlatFlowConfig,
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
  /** When true, renders stepperTitle above the timeline. Hidden by default. Same as SinglePane. */
  showStepperHeader?: boolean
  contentTitle?: string
  contentSubtitle?: string
  drawers?: Record<string, ComponentType<DrawerComponentProps>>
  onComplete?: (state: Record<string, unknown>) => void
  onClose?: () => void
  /**
   * Show the root header (icon, title, close button). Shown by default when header content is
   * provided — set to false for PLG flows that use contentTitle instead.
   */
  showRootHeader?: boolean
  /**
   * @deprecated Use `showRootHeader` instead (`showRootHeader={false}` replaces `hideHeader`).
   */
  hideHeader?: boolean
  /** Override the entire left pane (replaces the default stepper rail). DualPane-only layout. */
  leftPane?: ReactNode
  reactivationPrompt?: ReactivationPrompt
  // Disable auto-scrolling the right pane to the active card (on mount and on transitions). Use for
  // completed/review flows where the card stack should render from the top and stay put.
  disableAutoScroll?: boolean
  /** Left panel sizing as percentages. DualPane-only layout. */
  panelSizes?: { default?: number; min?: number; max?: number }
  /** When true, renders a "Step {n}/{total}" pill badge next to each step's title. Default false —
   *  purely opt-in, no rendering change for existing consumers that don't pass it. */
  showStepBadge?: boolean
  /** Grouped-mode only: omit groups whose derived state is `upcoming`. Visited and active groups
   *  still render. No-op on flat flows. Applies to the default left pane only. Visual only — engine
   *  derivation, routing, and badge totals are unchanged. Default false. */
  hideUpcomingGroups?: boolean
  /** Omit predicted nested-step placeholders in grouped mode, and upcoming entries from the flat
   *  timeline. Applies to the default left pane only. Visual only — engine derivation, routing,
   *  badge totals, and the indeterminate placeholder still follow the engine. Default false. */
  hidePredictedSteps?: boolean
  className?: string
  style?: CSSProperties
  /** Rendered after the visual content, inside `FlowEngineProvider` — for context-only consumers
   *  (e.g. a persist bridge) that need engine access without affecting layout. */
  children?: ReactNode
  /** Seeds the engine's state and card history on mount, restoring a previously persisted run. */
  initialEngineState?: InitialEngineState
}

// CardAction props come from the shared FlowStepperCardAction (single source of truth).
export type { FlowStepperCardActionProps as CardActionProps } from '../flow-stepper/flow-stepper-card-action'
