import type { CardEntry, FlowConfig } from './engine-types'

/**
 * Walks the flow's `next` pointers forward from `activeStepId` to the end of the actual path this
 * run will take, WITHOUT stopping at step-group boundaries — unlike `engine-context.tsx`'s
 * `predictedPath`, which deliberately stops at the first step whose `.step` (step group id) differs
 * from the active step's group (that scoping is correct for its own consumer, the indeterminate-badge
 * logic in `deriveStepperModel` below, and must not change).
 *
 * This exists because `flow.steps` is a flat map of EVERY step across EVERY branch in a FlowConfig,
 * not just the steps a given run will actually walk. Branching flows (e.g. mutually-exclusive
 * auth-provider or infra-setup steps that all converge on a shared next step) mean
 * `Object.keys(flow.steps).length` overcounts — a run only ever traverses one branch, so that count
 * can never be reached and a "Step n/total" badge would never hit n/n. Combined with `cardHistory`
 * (the steps already visited), this gives the true total step count for the CURRENT run's path.
 *
 * Mirrors `predictedPath`'s loop shape exactly (including the `visited` cycle guard sourced from
 * `cardHistory`) — it only drops the step-group-equality condition.
 */
export interface FullPredictedPathResult {
  path: string[]
  /** True when the WHOLE walk (not just its first hop off the active step) can be trusted as
   *  having reached a genuinely known end — the last step it actually reached (the active step
   *  itself, if the walk never advanced) is explicitly flagged `terminal` (a confirmed, designed
   *  end of the flow), or the walk looped back into already-visited history (a bounded,
   *  already-accounted-for cycle via the cycle guard). False whenever the walk stops merely
   *  because SOME step along the way — the active step itself, or one further downstream in the
   *  predicted path — has no static `next` and isn't flagged terminal. That step's real
   *  continuation may be decided dynamically at runtime by `complete(statePatch, nextStepId)` (see
   *  the module doc comment above and engine-context.tsx's `complete`), so more steps may
   *  genuinely follow that we cannot see statically — even if an earlier hop in the SAME walk did
   *  have a static `next`. (A step's own static `next` only proves the walk advanced one hop; it
   *  says nothing about whether a LATER hop in that same walk also resolved statically — that's
   *  the distinction this flag must capture, not just the active step's own first hop.) Callers
   *  computing a badge denominator should fall back to a flow-wide count instead of trusting
   *  `path.length` when this is false, so the total never undercounts. */
  reachedKnownEnd: boolean
}

export function deriveFullPredictedPath(
  flow: FlowConfig,
  cardHistory: CardEntry[],
  activeStepId: string
): FullPredictedPathResult {
  const predicted: string[] = []
  const visited = new Set(cardHistory.map(e => e.stepId))
  // Tracks the last step the walk actually reached — the active step itself if the walk never
  // advanced — so reachedKnownEnd below can be judged against where the walk truly stopped,
  // rather than re-derived solely from the active step's own `next` field.
  let lastStepId = activeStepId
  let current = flow.steps[activeStepId]?.next
  while (current && flow.steps[current] && !visited.has(current)) {
    predicted.push(current)
    visited.add(current)
    lastStepId = current
    current = flow.steps[current].next
  }
  // Known end iff: the step the walk actually stopped on is flagged terminal, OR the walk stopped
  // because `current` pointed at a step already in `visited` (a confirmed loop-back, not an
  // unresolved dynamic branch). Anything else — including "some earlier hop had a static `next`"
  // — is not sufficient; that was the bug (see derive-stepper-model.test.ts + the JSDoc above).
  const reachedKnownEnd = Boolean(flow.steps[lastStepId]?.terminal) || (current !== undefined && visited.has(current))
  return { path: predicted, reachedKnownEnd }
}

export interface DerivedStep {
  stepGroupId: string
  title: string
  description?: string
  state: 'completed' | 'active' | 'error' | 'upcoming'
  isTerminalStepGroup: boolean
  showIndeterminate: boolean
  visited: { stepId: string; state: 'active' | 'error' | 'skipped' | 'completed' }[]
  predicted: string[] // upcoming step ids within the active step group
}

interface BucketStateInput {
  /** All cardHistory entries belonging to this bucket (a step group's visited steps). */
  entries: CardEntry[]
  isActiveBucket: boolean
  activeStepId: string
  isFlowComplete: boolean
  visualCompletedFor: (stepId: string) => boolean
}

/**
 * Shared error/flow-complete/active/upcoming precedence rule, extracted from the step-group state
 * derivation in deriveStepperModel below so a bucket that degenerates to a single step (the future
 * flat-mode case) can reuse the identical precedence logic without duplicating it.
 *
 * Precedence:
 * 1. Error takes precedence over everything.
 * 2. Flow complete (or the active step is visualCompleted) + all entries resolved = completed.
 * 3. Active bucket = active.
 * 4. All entries resolved = completed.
 * 5. Otherwise upcoming.
 */
function deriveBucketState({
  entries,
  isActiveBucket,
  activeStepId,
  isFlowComplete,
  visualCompletedFor
}: BucketStateInput): 'completed' | 'active' | 'error' | 'upcoming' {
  const hasBeenVisited = entries.length > 0

  // Completion: every visited entry is resolved (completed/skipped, or an error the flow
  // recovered past — see hasError below, which only stays true for an UNRESOLVED trailing
  // error), OR flagged visualCompleted (a terminal step whose cardHistory status never
  // leaves 'active' once the engine's re-entry guard has fired — see engine-context.tsx's
  // complete()/error()/skip()). visualCompleted is a pure rendering hint; it does not change
  // the step's own visited.state, only whether the BUCKET counts as resolved.
  const allResolved =
    hasBeenVisited &&
    entries.every(
      e => e.status === 'completed' || e.status === 'skipped' || e.status === 'error' || visualCompletedFor(e.stepId)
    )

  // Error: the bucket is in an error state only if an errored entry is UNRESOLVED — i.e. the
  // last visited entry is the error (the flow is stopped on it, or it's a terminal error). If a
  // later entry follows the error (error-and-continue recovered past it), the bucket is NOT in
  // error; its state comes from the recovered entries below. This keeps "errored then recovered"
  // green rather than marking the whole bucket red for a failure the flow moved past.
  const lastVisited = entries[entries.length - 1]
  const hasError = lastVisited?.status === 'error'

  // A visualCompleted step that IS the active bucket's current position: isFlowComplete is
  // globally false while it's active, so without this, the ternary below would hit
  // `isActiveBucket ? 'active'` before ever reaching the allResolved fallback — the bucket
  // would render active/blue, a regression from the accidental green some flows show today.
  const activeVisualCompleted =
    isActiveBucket && entries.some(e => e.stepId === activeStepId && visualCompletedFor(e.stepId))

  return hasError
    ? 'error'
    : (isFlowComplete || activeVisualCompleted) && allResolved
      ? 'completed'
      : isActiveBucket
        ? 'active'
        : allResolved
          ? 'completed'
          : 'upcoming'
}

/**
 * Derives the per-step-group state model from the flow config, card history, predicted path, and active step.
 * This is a pure function that extracts the logic originally embedded in DefaultStepperPane.
 *
 * @param flow - The flow configuration defining step groups and steps
 * @param cardHistory - The history of visited steps with their statuses
 * @param predictedPath - The predicted upcoming step ids (within the active step group only, as per engine behavior)
 * @param activeStepId - The currently active step id
 * @returns An array of DerivedStep objects, one per step group in the flow
 */
export function deriveStepperModel(
  flow: FlowConfig,
  cardHistory: CardEntry[],
  predictedPath: string[],
  activeStepId: string
): DerivedStep[] {
  const activeStepGroupId = flow.steps[activeStepId]?.step

  // Bucket visited steps by their parent step group
  const visitedByStepGroup: Record<string, CardEntry[]> = {}
  for (const entry of cardHistory) {
    const stepGroupId = flow.steps[entry.stepId]?.step
    if (stepGroupId) {
      if (!visitedByStepGroup[stepGroupId]) visitedByStepGroup[stepGroupId] = []
      visitedByStepGroup[stepGroupId].push(entry)
    }
  }

  // Bucket predicted steps by their parent step group
  // NOTE: The engine currently only predicts steps within the active step group.
  // If this changes to include cross-step-group predictions, the showIndeterminate logic will need adjustment.
  const predictedByStepGroup: Record<string, string[]> = {}
  for (const stepId of predictedPath) {
    const stepGroupId = flow.steps[stepId]?.step
    if (stepGroupId) {
      if (!predictedByStepGroup[stepGroupId]) predictedByStepGroup[stepGroupId] = []
      predictedByStepGroup[stepGroupId].push(stepId)
    }
  }

  if (process.env.NODE_ENV === 'development' && flow.stepGroups && Object.keys(flow.stepGroups).length === 0) {
    console.warn(
      'FlowConfig.stepGroups is empty — the stepper will render no steps. Did you forget to define stepGroups?'
    )
  }

  return Object.entries(flow.stepGroups ?? {}).map(([stepGroupId, stepGroup]) => {
    const visited = visitedByStepGroup[stepGroupId] || []
    const predicted = predictedByStepGroup[stepGroupId] || []

    // A step group is terminal if no steps reference it
    const isTerminalStepGroup = !Object.values(flow.steps).some(s => s.step === stepGroupId)

    const isActiveStepGroup = activeStepGroupId === stepGroupId

    // showIndeterminate: active step group with no next step and no predicted steps — i.e. "waiting,
    // more may come" (renders the "..." placeholder). An errored step with no next is NOT waiting;
    // it's a stopped/terminal failure, so it must not show the placeholder.
    const activeStepErrored = isActiveStepGroup && visited.some(e => e.stepId === activeStepId && e.status === 'error')
    const activeHasNoNext = isActiveStepGroup && !flow.steps[activeStepId]?.next
    // A resolved active step (completed/skipped, flow settled) is not "waiting" either — only an
    // in-progress active step with no known next is indeterminate.
    const activeStepResolved =
      isActiveStepGroup && visited.some(e => e.stepId === activeStepId && e.status !== 'active')
    const showIndeterminate =
      isActiveStepGroup &&
      !isTerminalStepGroup &&
      activeHasNoNext &&
      predicted.length === 0 &&
      !activeStepErrored &&
      !activeStepResolved

    // Flow is complete when no card is active.
    const isFlowComplete = !cardHistory.some(e => e.status === 'active')

    // Step-group state derivation delegates to the shared bucket precedence rule (error / flow-
    // complete / active / upcoming) — see deriveBucketState above for the full rationale.
    const stepGroupState = deriveBucketState({
      entries: visited,
      isActiveBucket: isActiveStepGroup,
      activeStepId,
      isFlowComplete,
      visualCompletedFor: stepId => Boolean(flow.steps[stepId]?.visualCompleted)
    })

    return {
      stepGroupId,
      title: stepGroup.title,
      description: stepGroup.description,
      state: stepGroupState,
      isTerminalStepGroup,
      showIndeterminate,
      visited: visited.map(e => ({
        stepId: e.stepId,
        state:
          e.status === 'active'
            ? 'active'
            : e.status === 'error'
              ? 'error'
              : e.status === 'skipped'
                ? 'skipped'
                : 'completed'
      })),
      predicted
    }
  })
}

export interface DerivedFlatStep {
  stepId: string
  title: string
  description?: string
  state: 'completed' | 'active' | 'error' | 'upcoming' | 'skipped'
  visualCompleted: boolean
}

/**
 * Flat-mode counterpart to `deriveStepperModel`: derives one `DerivedFlatStep` per VISITED
 * step (cardHistory order) instead of one `DerivedStep` per step group. Each step is its own
 * bucket with exactly one cardHistory entry, so this reuses `deriveBucketState` directly rather
 * than aggregating multiple entries per step group. Appends one `DerivedFlatStep` per step on
 * `deriveFullPredictedPath`'s remaining static path as 'upcoming' placeholders, mirroring the
 * way `deriveStepperModel` surfaces `predicted` steps within the active step group — flows with
 * no static `next` anywhere (e.g. CDv2's dynamic-choice steps) simply produce no placeholders.
 * Consumed by `FlowStepperRail` (Task 5) for `flow.stepGroups`-less (flat) `FlowConfig`s.
 */
export function deriveFlatStepperModel(
  flow: FlowConfig,
  cardHistory: CardEntry[],
  activeStepId: string
): DerivedFlatStep[] {
  const isFlowComplete = !cardHistory.some(e => e.status === 'active')
  const visualCompletedFor = (stepId: string): boolean => Boolean(flow.steps[stepId]?.visualCompleted)

  const visited: DerivedFlatStep[] = cardHistory.map(entry => {
    const stepConfig = flow.steps[entry.stepId]
    const isActive = entry.stepId === activeStepId
    // deriveBucketState's return type has no 'skipped' member: step-GROUP buckets (its real
    // consumer, deriveStepperModel) can hold several entries, so it only cares whether the whole
    // bucket resolved, not each entry's own status — a skipped entry is just "resolved" to it,
    // same as completed, and folds into 'completed'. Flat mode's bucket is always exactly one
    // entry, so it can and must surface that entry's own 'skipped' status directly instead of
    // going through deriveBucketState's coarser aggregation. Do not widen deriveBucketState for
    // this — that function's contract is intentionally group-scoped.
    const state =
      entry.status === 'skipped'
        ? 'skipped'
        : deriveBucketState({
            entries: [entry],
            isActiveBucket: isActive,
            activeStepId,
            isFlowComplete,
            visualCompletedFor
          })

    return {
      stepId: entry.stepId,
      title: stepConfig?.title ?? entry.stepId,
      description: stepConfig?.description,
      state,
      visualCompleted: visualCompletedFor(entry.stepId)
    }
  })

  const { path } = deriveFullPredictedPath(flow, cardHistory, activeStepId)
  const upcoming: DerivedFlatStep[] = path.map(stepId => ({
    stepId,
    title: flow.steps[stepId]?.title ?? stepId,
    description: flow.steps[stepId]?.description,
    state: 'upcoming',
    visualCompleted: false
  }))

  return [...visited, ...upcoming]
}
