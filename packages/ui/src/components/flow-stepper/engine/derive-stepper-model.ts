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

    // showIndeterminate: active step with no next substep and no predicted substeps
    const activeHasNoNext = isActiveStep && !flow.subSteps[activeSubStepId]?.next
    const showIndeterminate = isActiveStep && !isTerminalStep && activeHasNoNext && predicted.length === 0

    // Completion: all visited substeps are completed or skipped
    const allSubStepsCompleted =
      hasBeenVisited && visited.every(e => e.status === 'completed' || e.status === 'skipped')

    // Error: any visited substep has error status
    const hasError = visited.some(e => e.status === 'error')

    // Flow is complete when no card is active
    const isFlowComplete = !cardHistory.some(e => e.status === 'active')

    // Derive step state with the exact precedence from DefaultStepperPane:
    // 1. Error takes precedence over everything
    // 2. Flow complete + all substeps completed = completed
    // 3. Active step = active
    // 4. All substeps completed = completed
    // 5. Otherwise upcoming
    const stepState: DerivedStep['state'] = hasError
      ? 'error'
      : isFlowComplete && allSubStepsCompleted
        ? 'completed'
        : isActiveStep
          ? 'active'
          : allSubStepsCompleted
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
