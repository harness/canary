import { type ComponentType } from 'react'

export interface StepGroupConfig {
  title: string
  description?: string
}

interface BaseStepConfig {
  title: string
  description?: string
  component: ComponentType
  next?: string
  // When true, complete()/error()/skip() on this step become permanent no-ops after
  // the first call (re-entry guard only). Does NOT affect the step's initial rendered status —
  // it always enters 'active' like any other step.
  terminal?: boolean
  // Explicit opt-in: this step's real continuation is decided dynamically at runtime (e.g. a card
  // calls `complete(statePatch, nextStepId)` with a step id chosen from its own logic, not a static
  // `next`) and cannot be predicted just by reading the flow config. Badge-total fallbacks
  // (use-flow-stepper-rail-model.ts's totalStepsCount/totalStepGroupsCount) use this to tell
  // "the walk stopped here because it's a genuine, designed end of the flow the author simply
  // forgot to flag `terminal`" (leave unset — trust the walked total, don't inflate it) apart from
  // "the walk stopped here only because we can't see further statically" (set this — more steps may
  // genuinely follow, so fall back to a flow-wide count instead of undercounting). Leave unset for
  // an ordinary designed end; this flag exists precisely so that case no longer needs the inflated
  // fallback.
  dynamicNext?: true
  // Presentation-only hint: always render this step as finished/success (icon + color),
  // regardless of actual cardHistory status. Does not affect the state machine, does not
  // affect re-entry (pair with `terminal` for that), does not affect accordion-open
  // behavior, and continues to reflect the real derived state.
  visualCompleted?: boolean
}

export interface GroupedStepConfig extends BaseStepConfig {
  step: string
}

export interface FlatStepConfig extends BaseStepConfig {
  step?: undefined
}

export type StepConfig = GroupedStepConfig | FlatStepConfig

export function isGroupedStepConfig(step: StepConfig): step is GroupedStepConfig {
  return step.step !== undefined
}

export function isFlatStepConfig(step: StepConfig): step is FlatStepConfig {
  return step.step === undefined
}

export interface GroupedFlowConfig {
  stepGroups: Record<string, StepGroupConfig>
  steps: Record<string, GroupedStepConfig>
  initialStep: string
}

export interface FlatFlowConfig {
  stepGroups?: undefined
  steps: Record<string, FlatStepConfig>
  initialStep: string
}

export type FlowConfig = GroupedFlowConfig | FlatFlowConfig

export function isGroupedFlowConfig(flow: FlowConfig): flow is GroupedFlowConfig {
  return flow.stepGroups !== undefined
}

export function isFlatFlowConfig(flow: FlowConfig): flow is FlatFlowConfig {
  return flow.stepGroups === undefined
}

export type CardStatus = 'active' | 'completed' | 'error' | 'skipped'

export interface CardEntry {
  stepId: string
  status: CardStatus
  stateSnapshot: Record<string, unknown>
}

/**
 * A serialized snapshot of engine state that a host app can pass to `FlowEngineProvider` (or
 * `SinglePaneStepper.Root` / `DualPaneStepper.Root`) to resume a flow instead of starting at
 * `flow.initialStep`.
 *
 * Canary does not persist this itself — the host app is responsible for storage/validation and
 * only passes an already-valid snapshot. An unusable snapshot (empty `cardHistory`, or any
 * `stepId` not present in the current `flow.steps`) is treated as omitted.
 */
export interface InitialEngineState {
  state: Record<string, unknown>
  cardHistory: CardEntry[]
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
  complete: (statePatch?: Partial<TState>, nextStepId?: string) => void
  // Mark this step errored. With no argument the error is recoverable (stays the active position).
  // With a nextStepId, the step is locked red in history and the flow advances (error-and-
  // continue); pass a step whose `terminal: true` (or which has no further next) to end in error.
  // NOTE: a step group summarizes as "recovered/completed" (green) only when the recovery step is in
  // the SAME step group. If the error continues into a different step group, the errored step group
  // stays red — its last step is the error. (Recovery is scoped per-step-group by design.)
  error: (nextStepId?: string) => void
  skip: (nextStepId?: string) => void
  openDrawer: (drawerId: string, props?: Record<string, unknown>) => Promise<DrawerResult>
}

export interface ReactivationPrompt {
  title: string
  description: string
}
