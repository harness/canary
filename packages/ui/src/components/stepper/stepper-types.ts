import { type ReactNode } from 'react'

export type StepState = 'completed' | 'active' | 'upcoming' | 'skipped' | 'error'

export interface StepperProps {
  value: string
  onValueChange: (value: string) => void
  title?: ReactNode
  onBeforeChange?: (from: string, to: string) => boolean | string
  showConnectors?: boolean
  completed?: boolean
  /** When true, nested steps with panel content show a collapse chevron (SinglePaneStepper). */
  collapsibleNestedSteps?: boolean
  skeletonCount?: number
  className?: string
  children?: ReactNode
}

export interface StepperGroupProps {
  value: string
  title: ReactNode
  description?: ReactNode
  state?: StepState
  loading?: boolean
  blocking?: boolean
  hasNestedSteps?: boolean
  disabled?: boolean
  /** When true, renders a "Step {n}/{total}" pill badge next to the group title. Default false —
   *  purely opt-in, no rendering change for existing consumers that don't pass it. */
  showStepBadge?: boolean
  /** Lets a non-flat-mode consumer supply the flow's real step-group count instead of the
   *  currently-registered count (see StepperStepProps.totalStepsOverride for the flat-mode analog). */
  totalStepsOverride?: number
  /** Overrides the "Step {n}/{total}" badge numerator (ctx.orderedSteps.indexOf(value) + 1) for
   *  non-flat-mode groups. THIS group's raw registration index also counts off-path
   *  mutually-exclusive sibling groups registered before it, inflating the numerator past its
   *  real path-order position once an off-path sibling renders ahead of an on-path
   *  active group (e.g. "Step 5/4"). Omit to fall back to the raw registration index. */
  stepNumberOverride?: number
  className?: string
  children?: ReactNode
}

export interface StepperStepProps {
  value: string
  title: ReactNode
  description?: ReactNode
  state?: StepState
  /** Presentation-only: render this step's icon/color as 'completed' regardless of `state`.
   *  Does NOT affect accordion-open behavior, which always reflects the real `state`. */
  visualCompleted?: boolean
  /** Force-disable this step's button. Only meaningful when this Step has no parent StepGroup
   *  (top-level registration) — a nested Step's disabled-ness is entirely derived from its
   *  parent group's state, matching today's nested-step behavior. */
  disabled?: boolean
  /** When true, render only the branch wire and panel — no step label row (single-pane accordion cards). */
  contentOnly?: boolean
  /** When true, renders a "Step {n}/{total}" pill badge next to the step title. Only meaningful
   *  when this Step has no parent StepGroup (top-level registration) — default false, purely
   *  opt-in, no rendering change for existing consumers that don't pass it. */
  showStepBadge?: boolean
  /** Lets a flat-mode consumer supply the flow's real nested-step count instead of the currently-registered count. */
  totalStepsOverride?: number
  className?: string
  children?: ReactNode
}
