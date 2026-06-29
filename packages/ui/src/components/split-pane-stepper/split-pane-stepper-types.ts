import { type ComponentType, type ReactNode } from 'react'

// === Flow Configuration ===

export interface StepConfig {
  title: string
  description?: string
}

export interface SubStepConfig {
  step: string
  title: string
  description?: string
  component: ComponentType
  next?: string
  // When true, the engine auto-completes this substep on entry — the card
  // renders in the "finished" state immediately without consumer-side logic.
  // The user's explicit complete() call then fires onComplete to exit the flow.
  terminal?: boolean
}

export interface FlowConfig {
  steps: Record<string, StepConfig>
  subSteps: Record<string, SubStepConfig>
  initialSubStep: string
}

// === State ===

export type CardStatus = 'active' | 'completed' | 'error' | 'skipped'

export interface CardEntry {
  subStepId: string
  status: CardStatus
  stateSnapshot: Record<string, unknown>
}

export interface DrawerResult {
  success: boolean
  data?: Record<string, unknown>
}

// === Drawer ===

export interface DrawerComponentProps {
  open: boolean
  onClose: (result: DrawerResult) => void
  props?: Record<string, unknown>
}

// === useFlowCard Hook ===

export interface FlowCardContext<TState = Record<string, unknown>> {
  state: TState
  status: CardStatus
  complete: (statePatch?: Partial<TState>, nextSubStepId?: string) => void
  error: () => void
  skip: (nextSubStepId?: string) => void
  openDrawer: (drawerId: string, props?: Record<string, unknown>) => Promise<DrawerResult>
}

// === Component Props ===

export interface ReactivationPrompt {
  title: string
  description: string
}

export interface SplitPaneStepperRootProps {
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

export interface CardActionProps {
  variant: 'warning' | 'danger' | 'info' | 'success'
  message: string
  actionLabel?: string
  onAction?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}
