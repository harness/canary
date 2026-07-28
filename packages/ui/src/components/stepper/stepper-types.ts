import { type ReactNode } from 'react'

export type StepState = 'completed' | 'active' | 'upcoming' | 'skipped' | 'error'

export interface StepperProps {
  value: string
  onValueChange: (value: string) => void
  title?: ReactNode
  onBeforeChange?: (from: string, to: string) => boolean | string
  showConnectors?: boolean
  completed?: boolean
  /** When true, substeps with panel content show a collapse chevron (SinglePaneStepper). */
  collapsibleSubSteps?: boolean
  skeletonCount?: number
  className?: string
  children?: ReactNode
}

export interface StepperStepProps {
  value: string
  title: ReactNode
  description?: ReactNode
  state?: StepState
  loading?: boolean
  blocking?: boolean
  hasSubSteps?: boolean
  disabled?: boolean
  className?: string
  children?: ReactNode
}

export interface StepperSubStepProps {
  value: string
  title: ReactNode
  description?: ReactNode
  state?: StepState
  /** Presentation-only: render this substep's icon/color as 'completed' regardless of `state`.
   *  Does NOT affect accordion-open behavior, which always reflects the real `state`. */
  visualCompleted?: boolean
  /** When true, render only the branch wire and panel — no substep label row (single-pane accordion cards). */
  contentOnly?: boolean
  className?: string
  children?: ReactNode
}
