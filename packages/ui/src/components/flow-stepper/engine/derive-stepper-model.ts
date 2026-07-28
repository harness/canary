import type { CardEntry, FlowConfig } from './engine-types'

export interface DerivedStep {
  stepId: string
  title: string
  description?: string
  state: 'completed' | 'active' | 'error' | 'upcoming'
  isTerminalStep: boolean
  showIndeterminate: boolean
  visited: { subStepId: string; state: 'active' | 'error' | 'skipped' | 'completed' }[]
  predicted: string[] // upcoming substep ids within the active step
}

/**
 * Derives the per-step state model from the flow config, card history, predicted path, and active substep.
 * This is a pure function that extracts the logic originally embedded in DefaultStepperPane.
 *
 * @param flow - The flow configuration defining steps and substeps
 * @param cardHistory - The history of visited substeps with their statuses
 * @param predictedPath - The predicted upcoming substep IDs (within the active step only, as per engine behavior)
 * @param activeSubStepId - The currently active substep ID
 * @returns An array of DerivedStep objects, one per step in the flow
 */
export function deriveStepperModel(
  flow: FlowConfig,
  cardHistory: CardEntry[],
  predictedPath: string[],
  activeSubStepId: string
): DerivedStep[] {
  const activeStepId = flow.subSteps[activeSubStepId]?.step

  // Bucket visited substeps by their parent step
  const visitedByStep: Record<string, CardEntry[]> = {}
  for (const entry of cardHistory) {
    const stepId = flow.subSteps[entry.subStepId]?.step
    if (stepId) {
      if (!visitedByStep[stepId]) visitedByStep[stepId] = []
      visitedByStep[stepId].push(entry)
    }
  }

  // Bucket predicted substeps by their parent step
  // NOTE: The engine currently only predicts substeps within the active step.
  // If this changes to include cross-step predictions, the showIndeterminate logic will need adjustment.
  const predictedByStep: Record<string, string[]> = {}
  for (const subStepId of predictedPath) {
    const stepId = flow.subSteps[subStepId]?.step
    if (stepId) {
      if (!predictedByStep[stepId]) predictedByStep[stepId] = []
      predictedByStep[stepId].push(subStepId)
    }
  }

  return Object.entries(flow.steps).map(([stepId, step]) => {
    const visited = visitedByStep[stepId] || []
    const predicted = predictedByStep[stepId] || []

    // A step is terminal if no substeps reference it
    const isTerminalStep = !Object.values(flow.subSteps).some(s => s.step === stepId)

    const isActiveStep = activeStepId === stepId
    const hasBeenVisited = visited.length > 0

    // showIndeterminate: active step with no next substep and no predicted substeps — i.e. "waiting,
    // more may come" (renders the "..." placeholder). An errored substep with no next is NOT waiting;
    // it's a stopped/terminal failure, so it must not show the placeholder.
    const activeSubStepErrored =
      isActiveStep && visited.some(e => e.subStepId === activeSubStepId && e.status === 'error')
    const activeHasNoNext = isActiveStep && !flow.subSteps[activeSubStepId]?.next
    // A resolved active substep (completed/skipped, flow settled) is not "waiting" either — only an
    // in-progress active substep with no known next is indeterminate.
    const activeSubStepResolved =
      isActiveStep && visited.some(e => e.subStepId === activeSubStepId && e.status !== 'active')
    const showIndeterminate =
      isActiveStep &&
      !isTerminalStep &&
      activeHasNoNext &&
      predicted.length === 0 &&
      !activeSubStepErrored &&
      !activeSubStepResolved

    // Completion: every visited substep is resolved (completed/skipped, or an error the flow
    // recovered past — see hasError below, which only stays true for an UNRESOLVED trailing
    // error), OR flagged visualCompleted (a terminal substep whose cardHistory status never
    // leaves 'active' once the engine's re-entry guard has fired — see engine-context.tsx's
    // complete()/error()/skip()). visualCompleted is a pure rendering hint; it does not change
    // the substep's own visited.state below, only whether the STEP counts as resolved.
    const allSubStepsResolved =
      hasBeenVisited &&
      visited.every(
        e =>
          e.status === 'completed' ||
          e.status === 'skipped' ||
          e.status === 'error' ||
          flow.subSteps[e.subStepId]?.visualCompleted
      )

    // Error: the step is in an error state only if an errored substep is UNRESOLVED — i.e. the last
    // visited substep is the error (the flow is stopped on it, or it's a terminal error). If a later
    // substep follows the error (error-and-continue recovered past it), the step is NOT in error; its
    // state comes from the recovered substeps below. This keeps "errored then recovered" green rather
    // than marking the whole step red for a failure the flow moved past.
    const lastVisited = visited[visited.length - 1]
    const hasError = lastVisited?.status === 'error'

    // Flow is complete when no card is active.
    const isFlowComplete = !cardHistory.some(e => e.status === 'active')

    // A visualCompleted substep that IS the active step's current position: isFlowComplete is
    // globally false while it's active (see above), so without this, the ternary below would hit
    // `isActiveStep ? 'active'` before ever reaching the allSubStepsResolved fallback — the step
    // would render active/blue, a regression from the accidental green some flows show today.
    const activeSubStepVisualCompleted =
      isActiveStep && visited.some(e => e.subStepId === activeSubStepId && flow.subSteps[e.subStepId]?.visualCompleted)

    // Derive step state with the precedence from DefaultStepperPane, extended for visualCompleted:
    // 1. Error takes precedence over everything
    // 2. Flow complete (or the active substep is visualCompleted) + all substeps resolved = completed
    // 3. Active step = active
    // 4. All substeps resolved = completed
    // 5. Otherwise upcoming
    const stepState: DerivedStep['state'] = hasError
      ? 'error'
      : (isFlowComplete || activeSubStepVisualCompleted) && allSubStepsResolved
        ? 'completed'
        : isActiveStep
          ? 'active'
          : allSubStepsResolved
            ? 'completed'
            : 'upcoming'

    return {
      stepId,
      title: step.title,
      description: step.description,
      state: stepState,
      isTerminalStep,
      showIndeterminate,
      visited: visited.map(e => ({
        subStepId: e.subStepId,
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
