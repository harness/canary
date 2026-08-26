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
  /** Grouped-mode only: true when stepNumberOverrides reflects the run's FULL path certainty — the
   * caller's predicted-path walk reached a genuinely known end (its last step, wherever the walk
   * actually stopped — the active step itself, or several hops downstream — is flagged `terminal`,
   * or the walk cycled back into its own visited history). False whenever any step along that walk
   * lacks a static `next` and isn't `terminal`; that step's real continuation may be decided
   * dynamically at runtime, so groups absent from stepNumberOverrides might just be beyond that
   * unresolved point, not genuinely off-path, and their step number must not be hidden — see
   * stepGroupHasNumber below. (The caller narrows this further with the `dynamicNext` step-config
   * flag — an unflagged dead end counts as a genuinely known end too — see
   * use-flow-stepper-rail-model.ts's pathWalkComplete.) */
  stepNumberOverridesComplete?: boolean
  /** Forwarded to `Stepper.Root`. Both default rails (SinglePane timeline and DualPane left pane)
   * set this so nested-step chrome matches. DualPane still omits `renderStepContent` because cards
   * live in the right pane. Stays opt-in here so a custom DualPane `leftPane` is not forced into it. */
  collapsibleNestedSteps?: boolean
  /** Renders inline content under a visited/active step. Omit for a rail with no inline content
   * (DualPaneStepper's left pane — its card content lives in the separate right pane instead). */
  renderStepContent?: (stepId: string, status: CardStatus) => ReactNode
  /** Optional header chrome for a visited/active collapsible step, rendered immediately left of
   * the expand/collapse caret. SinglePaneStepper uses this for Restart so tile content is not
   * squeezed. Omit to render no header actions (DualPaneStepper). */
  renderStepHeaderActions?: (stepId: string, status: CardStatus) => ReactNode
  /** Grouped-mode only: omit groups whose derived state is `upcoming`. Visited and active groups
   * still render. No-op on flat flows (no groups). Visual only — engine derivation, routing, and
   * badge totals are unchanged. Default false. */
  hideUpcomingGroups?: boolean
  /** Omit predicted nested-step placeholders in grouped mode, and upcoming entries from
   * `deriveFlatStepperModel` in flat mode. Visual only — engine derivation, routing, badge totals,
   * and the indeterminate placeholder still follow the engine. Default false. */
  hidePredictedSteps?: boolean
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
  renderStepContent,
  renderStepHeaderActions,
  hideUpcomingGroups,
  hidePredictedSteps
}: FlowStepperRailProps) {
  const cardStatusMap = new Map(cardHistory.map(e => [e.stepId, e.status]))
  const title = showStepperHeader ? stepperTitle : undefined

  if (!flow.stepGroups) {
    const derivedSteps = deriveFlatStepperModel(flow, cardHistory, activeStepId)
    const stepsToRender = hidePredictedSteps ? derivedSteps.filter(step => step.state !== 'upcoming') : derivedSteps

    return (
      <Stepper.Root
        value={value}
        onValueChange={onValueChange}
        title={title}
        collapsibleNestedSteps={collapsibleNestedSteps}
      >
        {stepsToRender.map(step => {
          const status = cardStatusMap.get(step.stepId)
          const content = status && renderStepContent ? renderStepContent(step.stepId, status) : null
          const headerActions =
            status && renderStepHeaderActions ? renderStepHeaderActions(step.stepId, status) : undefined

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
              headerActions={headerActions}
            >
              {content}
            </Stepper.Step>
          )
        })}
      </Stepper.Root>
    )
  }

  const derivedSteps = deriveStepperModel(flow, cardHistory, predictedPath, activeStepId)
  const groupsToRender = hideUpcomingGroups
    ? derivedSteps.filter(derivedStep => derivedStep.state !== 'upcoming')
    : derivedSteps

  // A group absent from stepNumberOverrides still needs its OWN number whenever the map is
  // incomplete (see stepGroupHasNumber below) — but it must not fall back to its raw stepIndex
  // (position among ALL rendered groups): an off-path sibling can render between two on-path
  // groups, so its stepIndex can coincide with a real override assigned to a group after it (round 6
  // bug — e.g. an off-path "provider-b" rendering before a real "connect" step numbered 3 would also
  // land on 3 via stepIndex+1). Instead, synthesize numbers strictly above every REAL override in the
  // map — computed once, not per-group, so they can never collide with one — continuing in render
  // order for every group that needs one.
  const highestOverrideNumber =
    stepNumberOverrides && stepNumberOverrides.size > 0 ? Math.max(...stepNumberOverrides.values()) : 0
  let nextFallbackStepNumber = highestOverrideNumber
  const fallbackStepNumbers = new Map<string, number>()
  for (const derivedStep of derivedSteps) {
    if (stepNumberOverrides?.has(derivedStep.stepGroupId)) continue
    if (!stepNumberOverrides || stepNumberOverridesComplete) continue // no synthesis needed — stepper-group.tsx's own stepIndex+1 fallback is safe here (no real overrides to collide with, or the map is already complete)
    nextFallbackStepNumber += 1
    fallbackStepNumbers.set(derivedStep.stepGroupId, nextFallbackStepNumber)
  }

  return (
    <Stepper.Root
      value={value}
      onValueChange={onValueChange}
      title={title}
      collapsibleNestedSteps={collapsibleNestedSteps}
    >
      {groupsToRender.map(derivedStep => {
        const activeStepGroupId = flow.steps[activeStepId]?.step
        const isActiveStepGroup = activeStepGroupId === derivedStep.stepGroupId
        const showSteps = derivedStep.visited.length > 0 || isActiveStepGroup
        // A group absent from stepNumberOverrides is only genuinely off-path (a mutually-exclusive
        // sibling never walked on this run) if the map itself is COMPLETE — i.e.
        // stepNumberOverridesComplete is true. When the walk stopped early because SOME step along
        // it — the active step itself, or several hops downstream — has no static `next` and isn't
        // `terminal` (a real shape, e.g. CDv2's deployment-pipeline-v2 flow, where a card picks its
        // own next step dynamically), groups beyond that point are simply not yet known, not
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
            stepNumberOverride={
              stepNumberOverrides?.get(derivedStep.stepGroupId) ?? fallbackStepNumbers.get(derivedStep.stepGroupId)
            }
            hideStepNumber={!stepGroupHasNumber}
          >
            {showSteps &&
              !derivedStep.isTerminalStepGroup &&
              derivedStep.visited.map(v => {
                const stepConfig = flow.steps[v.stepId]
                const status = cardStatusMap.get(v.stepId)
                const content = status && renderStepContent ? renderStepContent(v.stepId, status) : null
                const headerActions =
                  status && renderStepHeaderActions ? renderStepHeaderActions(v.stepId, status) : undefined

                return (
                  <Stepper.Step
                    key={v.stepId}
                    value={v.stepId}
                    title={stepConfig?.title}
                    description={stepConfig?.description}
                    state={v.state}
                    visualCompleted={stepConfig?.visualCompleted}
                    headerActions={headerActions}
                  >
                    {content}
                  </Stepper.Step>
                )
              })}
            {isActiveStepGroup &&
              !hidePredictedSteps &&
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
