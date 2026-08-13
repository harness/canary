import { ReactNode } from 'react'

import { Stepper } from '../stepper'
import { deriveFlatStepperModel, deriveStepperModel, type CardEntry, type CardStatus, type FlowConfig } from './engine'

export interface FlowStepperRailProps {
  flow: FlowConfig
  cardHistory: CardEntry[]
  activeStepId: string
  predictedPath: string[]
  value: string
  onValueChange: (value: string) => void
  stepperTitle?: string
  showStepperHeader?: boolean
  /** When true, renders a "Step {n}/{total}" pill badge next to each step's title. */
  showStepBadge?: boolean
  /** Badge denominator override — the caller computes this (it needs cardHistory + the full
   * predicted-path walk, which live in the caller's own bookkeeping, not here). */
  totalOverride?: number
  /** Grouped-mode only: per-group numerator override for the "Step {n}/{total}" badge, keyed by
   * step-group id. The caller computes each group's real path-order position here, the same way
   * it already computes totalOverride's path-scoped denominator, so an off-path
   * mutually-exclusive sibling group rendering ahead of an on-path group doesn't inflate that
   * group's own numerator (e.g. off-path sibling registered before an active StepperGroup). */
  stepNumberOverrides?: Map<string, number>
  /** Grouped-mode only: true when stepNumberOverrides reflects the run's FULL path certainty (the
   * caller's predicted-path walk reached a known terminal, i.e. every step along the way had a
   * static `next`). False when the walk stopped early because the active step's own destination is
   * decided dynamically at runtime — in that case, groups absent from stepNumberOverrides might just
   * be beyond the unresolved point, not genuinely off-path, so their step number must not be
   * hidden. */
  stepNumberOverridesComplete?: boolean
  /** Forwarded to `Stepper.Root`. SinglePaneStepperCardStack's current `<Stepper.Root>` always sets
   * this; DualPaneStepper's current `<Stepper.Root>` never does — `collapsibleNestedSteps` changes
   * real rendering behavior (caps the active trunk and hides the indeterminate placeholder), so it
   * must stay opt-in per caller instead of being hardcoded here. */
  collapsibleNestedSteps?: boolean
  /** Renders inline content under a visited/active step. Omit for a rail with no inline content
   * (DualPaneStepper's left pane — its card content lives in the separate right pane instead). */
  renderStepContent?: (stepId: string, status: CardStatus) => ReactNode
}

export function FlowStepperRail({
  flow,
  cardHistory,
  activeStepId,
  predictedPath,
  value,
  onValueChange,
  stepperTitle,
  showStepperHeader,
  showStepBadge,
  totalOverride,
  stepNumberOverrides,
  stepNumberOverridesComplete,
  collapsibleNestedSteps,
  renderStepContent
}: FlowStepperRailProps) {
  const cardStatusMap = new Map(cardHistory.map(e => [e.stepId, e.status]))
  const title = showStepperHeader ? stepperTitle : undefined

  if (!flow.stepGroups) {
    const derivedSteps = deriveFlatStepperModel(flow, cardHistory, activeStepId)

    return (
      <Stepper.Root
        value={value}
        onValueChange={onValueChange}
        title={title}
        collapsibleNestedSteps={collapsibleNestedSteps}
      >
        {derivedSteps.map(step => {
          const status = cardStatusMap.get(step.stepId)
          const content = status && renderStepContent ? renderStepContent(step.stepId, status) : null

          return (
            <Stepper.Step
              key={step.stepId}
              value={step.stepId}
              title={step.title}
              description={step.description}
              state={step.state}
              visualCompleted={step.visualCompleted}
              showStepBadge={showStepBadge}
              totalStepsOverride={totalOverride}
            >
              {content}
            </Stepper.Step>
          )
        })}
      </Stepper.Root>
    )
  }

  const derivedSteps = deriveStepperModel(flow, cardHistory, predictedPath, activeStepId)

  return (
    <Stepper.Root
      value={value}
      onValueChange={onValueChange}
      title={title}
      collapsibleNestedSteps={collapsibleNestedSteps}
    >
      {derivedSteps.map(derivedStep => {
        const activeStepGroupId = flow.steps[activeStepId]?.step
        const isActiveStepGroup = activeStepGroupId === derivedStep.stepGroupId
        const showSteps = derivedStep.visited.length > 0 || isActiveStepGroup
        // A group absent from stepNumberOverrides is only genuinely off-path (a mutually-exclusive
        // sibling never walked on this run) if the map itself is COMPLETE — i.e.
        // stepNumberOverridesComplete is true. When the walk stopped early because the active
        // step's own destination is decided dynamically at runtime (a real shape, e.g. CDv2's
        // deployment-pipeline-v2 flow), groups beyond that point are simply not yet known, not
        // off-path, and hiding their number would strip legitimate step numbers from a flow that
        // was never actually off-path. Only suppress the number when a map exists AND is confirmed
        // complete AND this specific group isn't in it.
        const stepGroupHasNumber =
          !stepNumberOverrides || !stepNumberOverridesComplete || stepNumberOverrides.has(derivedStep.stepGroupId)

        return (
          <Stepper.StepGroup
            key={derivedStep.stepGroupId}
            value={derivedStep.stepGroupId}
            title={derivedStep.title}
            description={derivedStep.description}
            state={derivedStep.state}
            hasNestedSteps={derivedStep.showIndeterminate}
            showStepBadge={showStepBadge}
            totalStepsOverride={totalOverride}
            stepNumberOverride={stepNumberOverrides?.get(derivedStep.stepGroupId)}
            hideStepNumber={!stepGroupHasNumber}
          >
            {showSteps &&
              !derivedStep.isTerminalStepGroup &&
              derivedStep.visited.map(v => {
                const stepConfig = flow.steps[v.stepId]
                const status = cardStatusMap.get(v.stepId)
                const content = status && renderStepContent ? renderStepContent(v.stepId, status) : null

                return (
                  <Stepper.Step
                    key={v.stepId}
                    value={v.stepId}
                    title={stepConfig?.title}
                    description={stepConfig?.description}
                    state={v.state}
                    visualCompleted={stepConfig?.visualCompleted}
                  >
                    {content}
                  </Stepper.Step>
                )
              })}
            {isActiveStepGroup &&
              !derivedStep.isTerminalStepGroup &&
              derivedStep.predicted.map(stepId => (
                <Stepper.Step
                  key={stepId}
                  value={stepId}
                  title={flow.steps[stepId]?.title}
                  description={flow.steps[stepId]?.description}
                  state="upcoming"
                />
              ))}
          </Stepper.StepGroup>
        )
      })}
    </Stepper.Root>
  )
}
