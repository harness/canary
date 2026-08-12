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
