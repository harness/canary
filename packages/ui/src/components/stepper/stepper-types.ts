import { type ReactNode } from 'react'

export type StepState = 'completed' | 'active' | 'upcoming' | 'skipped' | 'error'

export interface StepperProps {
  value: string
  onValueChange: (value: string) => void
  title?: ReactNode
  onBeforeChange?: (from: string, to: string) => boolean | string
  showConnectors?: boolean
  completed?: boolean
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
  className?: string
}
