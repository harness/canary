import { type ComponentType } from 'react'

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
  // When true, complete()/error()/skip() on this substep become permanent no-ops after the
  // first call (re-entry guard only). Does NOT affect this substep's initial rendered status —
  // it always enters 'active' like any other substep.
  terminal?: boolean
  // Presentation-only hint: always render this substep as finished/success (icon + color),
  // regardless of its actual cardHistory status. Does not affect the state machine, does not
  // affect re-entry (pair with `terminal` for that), and does not affect accordion-open
  // behavior, which continues to reflect the real derived state.
  visualCompleted?: boolean
}

export interface FlowConfig {
  steps: Record<string, StepConfig>
  subSteps: Record<string, SubStepConfig>
  initialSubStep: string
}

export type CardStatus = 'active' | 'completed' | 'error' | 'skipped'

export interface CardEntry {
  subStepId: string
  status: CardStatus
  stateSnapshot: Record<string, unknown>
}

/**
 * The result a drawer adapter passes to `onClose` to resolve the `openDrawer` promise.
 *
 * `success` is the confirm-vs-dismiss signal every consumer relies on:
 * - `true`  — the user confirmed/selected something; `data` carries the selection.
 * - `false` — the user dismissed/cancelled (backdrop, Escape, X, or an explicit cancel);
 *   `data` is absent/ignored.
 *
 * Consumers should branch on `success` rather than inspecting `data` shape to infer intent.
 */
export interface DrawerResult {
  success: boolean
  data?: Record<string, unknown>
}

/**
 * Props the stepper host passes to a registered drawer adapter.
 *
 * `open` is always `true` while the adapter is mounted — the host mounts the adapter when the
 * drawer opens and unmounts it on close, so adapters must NOT mirror `open` into local state
 * (there is no false→true transition to react to; a fresh mount already means a fresh open).
 *
 * CONTRACT: the adapter MUST call `onClose` on EVERY exit path — confirm AND every dismiss path
 * (backdrop, Escape, X, cancel button). A dismiss that never calls `onClose` leaves the awaiting
 * `openDrawer` promise unresolved and stalls the flow. Resolve `{ success: false }` on dismiss.
 * Calling `onClose` more than once is safe (the host resolves the promise only once).
 */
export interface DrawerComponentProps {
  open: boolean
  onClose: (result: DrawerResult) => void
  props?: Record<string, unknown>
}

export interface FlowCardContext<TState = Record<string, unknown>> {
  state: TState
  status: CardStatus
  complete: (statePatch?: Partial<TState>, nextSubStepId?: string) => void
  // Mark this substep errored. With no argument the error is recoverable (stays the active position).
  // With a nextSubStepId, the substep is locked red in history and the flow advances (error-and-
  // continue); pass a substep whose `terminal: true` (or which has no further next) to end in error.
  // NOTE: a step summarizes as "recovered/completed" (green) only when the recovery substep is in
  // the SAME step. If the error continues into a different step, the errored step stays red — its
  // last substep is the error. (Recovery is scoped per-step by design.)
  error: (nextSubStepId?: string) => void
  skip: (nextSubStepId?: string) => void
  openDrawer: (drawerId: string, props?: Record<string, unknown>) => Promise<DrawerResult>
}

export interface ReactivationPrompt {
  title: string
  description: string
}
