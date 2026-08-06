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
  /** True when the walk can be trusted as the complete remaining path for this run — it either
   *  advanced past the active step via at least one static `next` pointer, stopped at the cycle
   *  guard (a bounded, already-accounted-for loop), or the active step is explicitly flagged
   *  `terminal` (a confirmed, designed end of the flow). False only when the walk never advanced
   *  at all — the active step itself has no static `next` and isn't flagged terminal — meaning its
   *  real continuation may be decided dynamically at runtime by `complete(statePatch, nextStepId)`
   *  (see the module doc comment above and engine-context.tsx's `complete`), so more steps may
   *  genuinely follow that we cannot see statically. Callers computing a badge denominator should
   *  fall back to a flow-wide count instead of trusting `path.length` when this is false, so the
   *  total never undercounts. */
  reachedKnownEnd: boolean
}

export function deriveFullPredictedPath(
  flow: FlowConfig,
  cardHistory: CardEntry[],
  activeStepId: string
): FullPredictedPathResult {
  const predicted: string[] = []
  const visited = new Set(cardHistory.map(e => e.stepId))
  let current = flow.steps[activeStepId]?.next
  const hasStaticNext = Boolean(current)
  while (current && flow.steps[current] && !visited.has(current)) {
    predicted.push(current)
    visited.add(current)
    current = flow.steps[current].next
  }
  const reachedKnownEnd = hasStaticNext || Boolean(flow.steps[activeStepId]?.terminal)
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

  if (process.env.NODE_ENV === 'development' && Object.keys(flow.stepGroups ?? {}).length === 0) {
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
    const hasBeenVisited = visited.length > 0

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

    // Completion: every visited step is resolved (completed/skipped, or an error the flow
    // recovered past — see hasError below, which only stays true for an UNRESOLVED trailing
    // error), OR flagged visualCompleted (a terminal step whose cardHistory status never
    // leaves 'active' once the engine's re-entry guard has fired — see engine-context.tsx's
    // complete()/error()/skip()). visualCompleted is a pure rendering hint; it does not change
    // the step's own visited.state below, only whether the STEP GROUP counts as resolved.
    const allStepsResolved =
      hasBeenVisited &&
      visited.every(
        e =>
          e.status === 'completed' ||
          e.status === 'skipped' ||
          e.status === 'error' ||
          flow.steps[e.stepId]?.visualCompleted
      )

    // Error: the step group is in an error state only if an errored step is UNRESOLVED — i.e. the
    // last visited step is the error (the flow is stopped on it, or it's a terminal error). If a
    // later step follows the error (error-and-continue recovered past it), the step group is NOT in
    // error; its state comes from the recovered steps below. This keeps "errored then recovered"
    // green rather than marking the whole step group red for a failure the flow moved past.
    const lastVisited = visited[visited.length - 1]
    const hasError = lastVisited?.status === 'error'

    // Flow is complete when no card is active.
    const isFlowComplete = !cardHistory.some(e => e.status === 'active')

    // A visualCompleted step that IS the active step group's current position: isFlowComplete is
    // globally false while it's active (see above), so without this, the ternary below would hit
    // `isActiveStepGroup ? 'active'` before ever reaching the allStepsResolved fallback — the step
    // group would render active/blue, a regression from the accidental green some flows show today.
    const activeStepVisualCompleted =
      isActiveStepGroup && visited.some(e => e.stepId === activeStepId && flow.steps[e.stepId]?.visualCompleted)

    // Derive step group state with the precedence from DefaultStepperPane, extended for visualCompleted:
    // 1. Error takes precedence over everything
    // 2. Flow complete (or the active step is visualCompleted) + all steps resolved = completed
    // 3. Active step group = active
    // 4. All steps resolved = completed
    // 5. Otherwise upcoming
    const stepGroupState: DerivedStep['state'] = hasError
      ? 'error'
      : (isFlowComplete || activeStepVisualCompleted) && allStepsResolved
        ? 'completed'
        : isActiveStepGroup
          ? 'active'
          : allStepsResolved
            ? 'completed'
            : 'upcoming'

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
