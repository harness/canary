import { useCallback, useEffect, useMemo, useRef } from 'react'

import {
  CardContextProvider,
  deriveFullPredictedPath,
  deriveStepperModel,
  useEngineContext
} from '../flow-stepper/engine'
import { Layout } from '../layout'
import { Stepper } from '../stepper'
import { Text } from '../text'

interface SinglePaneStepperCardStackProps {
  stepperTitle?: string
  showStepperHeader?: boolean
  contentTitle?: string
  contentSubtitle?: string
  /** When true, renders a "Step {n}/{total}" pill badge next to each step's title. Default false —
   *  purely opt-in, no rendering change for existing consumers that don't pass it. */
  showStepBadge?: boolean
  /** When true, renders each step group's steps as flat top-level `Stepper.Step` items (plain straight
   *  connector, self-registered directly under `Stepper.Root` — no `Stepper.StepGroup` wrapper)
   *  instead of the default nested/branch-connector layout. Default false — purely opt-in, no
   *  rendering change for existing consumers that don't pass it. */
  flat?: boolean
}

export function SinglePaneStepperCardStack({
  stepperTitle,
  showStepperHeader,
  contentTitle,
  contentSubtitle,
  showStepBadge,
  flat
}: SinglePaneStepperCardStackProps) {
  const { flow, cardHistory, activeStepId, predictedPath, registerScrollToCard, scrollToCard, disableAutoScroll } =
    useEngineContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(activeStepId)
  activeRef.current = activeStepId

  const scrollToCardLocal = useCallback(
    (stepId: string) => {
      // Consumers can disable all programmatic scroll (completed/review flows) — the timeline then
      // renders from the top and stays put; only the user scrolls.
      if (disableAutoScroll) return
      const container = containerRef.current
      if (!container) return
      const cardEl = container.querySelector(`[data-card-id="${stepId}"]`) as HTMLElement | null
      if (!cardEl) return

      const containerRect = container.getBoundingClientRect()
      const cardRect = cardEl.getBoundingClientRect()
      const offsetTop = cardRect.top - containerRect.top + container.scrollTop
      const targetScroll = offsetTop

      // JSDOM doesn't implement scrollTo; fall back to direct scrollTop for test environments
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' })
      } else {
        container.scrollTop = Math.max(0, targetScroll)
      }
    },
    [containerRef, disableAutoScroll]
  )

  useEffect(() => {
    registerScrollToCard(scrollToCardLocal)
  }, [registerScrollToCard, scrollToCardLocal])

  useEffect(() => {
    if (activeRef.current) {
      const timeoutId = setTimeout(() => scrollToCardLocal(activeRef.current), 50)
      return () => clearTimeout(timeoutId)
    }
  }, [scrollToCardLocal])

  const derivedSteps = useMemo(
    () => deriveStepperModel(flow, cardHistory, predictedPath, activeStepId),
    [flow, cardHistory, predictedPath, activeStepId]
  )

  // The badge denominators below must reflect only the path THIS run will actually walk, not every
  // step configured in the flow. `flow.steps` is a flat map of EVERY step across EVERY branch —
  // real flows branch heavily (e.g. mutually-exclusive auth-provider or infra-setup steps that all
  // converge on a shared next step), and a run only ever traverses one branch. Using
  // `Object.keys(flow.steps).length` as the denominator overcounts every step NOT on this run's
  // path, so the badge could never reach n/n. `deriveFullPredictedPath` walks the same `next`-pointer
  // chain as `predictedPath` (engine-context.tsx) but doesn't stop at step-group boundaries, giving
  // the full remainder of THIS run's path from the active step to the flow's terminal step.
  const { path: fullPredictedPath, reachedKnownEnd } = useMemo(
    () => deriveFullPredictedPath(flow, cardHistory, activeStepId),
    [flow, cardHistory, activeStepId]
  )

  // Flat mode's badge denominator: individual steps already visited plus the individual steps still
  // ahead on this run's actual path. When the walk couldn't confirm the true end of this run's path
  // (the active step's real destination is decided dynamically at runtime — see
  // deriveFullPredictedPath's doc comment), never let the denominator collapse below what's already
  // known; fall back to the flow-wide step count instead of undercounting.
  const totalStepsCount = useMemo(() => {
    const walkedTotal = cardHistory.length + fullPredictedPath.length
    if (reachedKnownEnd) return walkedTotal
    return Math.max(walkedTotal, Object.keys(flow.steps).length)
  }, [cardHistory, fullPredictedPath, reachedKnownEnd, flow.steps])

  // Non-flat mode's badge denominator: distinct step GROUPS among the steps already visited plus the
  // steps still ahead on this run's actual path (mirrors totalStepsCount, but counts groups, with
  // the same fallback-rather-than-undercount rule when reachedKnownEnd is false).
  const totalStepGroupsCount = useMemo(() => {
    const stepGroupIds = new Set<string>()
    for (const entry of cardHistory) {
      const stepGroupId = flow.steps[entry.stepId]?.step
      if (stepGroupId) stepGroupIds.add(stepGroupId)
    }
    for (const stepId of fullPredictedPath) {
      const stepGroupId = flow.steps[stepId]?.step
      if (stepGroupId) stepGroupIds.add(stepGroupId)
    }
    const walkedTotal = stepGroupIds.size
    if (reachedKnownEnd) return walkedTotal
    return Math.max(walkedTotal, Object.keys(flow.stepGroups ?? {}).length)
  }, [cardHistory, fullPredictedPath, reachedKnownEnd, flow.steps, flow.stepGroups])

  // Progressive disclosure: only render step groups that have been reached (active, completed, or error).
  const visibleStepGroups = useMemo(() => derivedSteps.filter(step => step.state !== 'upcoming'), [derivedSteps])

  // Build map of stepId -> card status from cardHistory for status prop
  const cardStatusMap = new Map(cardHistory.map(e => [e.stepId, e.status]))

  const handleStepperClick = (value: string) => {
    const historyEntry = cardHistory.find(e => e.stepId === value)
    if (historyEntry) {
      scrollToCard(historyEntry.stepId)
      return
    }
    const firstInStepGroup = cardHistory.find(e => flow.steps[e.stepId]?.step === value)
    if (firstInStepGroup) {
      scrollToCard(firstInStepGroup.stepId)
    }
  }

  return (
    <div ref={containerRef} className="cn-single-pane-stepper-card-stack">
      <div className="cn-single-pane-stepper-card-stack-inner">
        {(contentTitle || contentSubtitle) && (
          <Layout.Vertical gap="2xs" className="cn-single-pane-stepper-content-header">
            {contentTitle && (
              <Text as="h2" variant="heading-subsection" color="foreground-1" className="!m-0">
                {contentTitle}
              </Text>
            )}
            {contentSubtitle && (
              <Text as="p" variant="body-normal" color="foreground-1" className="!m-0">
                {contentSubtitle}
              </Text>
            )}
          </Layout.Vertical>
        )}

        <Stepper.Root
          value={activeStepId}
          onValueChange={handleStepperClick}
          title={showStepperHeader ? stepperTitle : undefined}
          collapsibleNestedSteps
        >
          {visibleStepGroups.map(derivedStep => {
            const activeStepGroupId = flow.steps[activeStepId]?.step
            const isActiveStepGroup = activeStepGroupId === derivedStep.stepGroupId
            const showSteps = derivedStep.visited.length > 0 || isActiveStepGroup

            // Flat mode: no Stepper.StepGroup wrapper. Each visited step renders as a top-level
            // Stepper.Step — the dual-mode Step component (see stepper-step.tsx) auto-detects "no
            // ancestor StepGroup" via useParentStep() returning null and renders itself as
            // TopLevelStep (plain straight connector, self-registered into ctx.orderedSteps), so no
            // extra plumbing (no ParentStepProvider) is needed here. The derivedStep's own
            // title/description/state are unused in this branch — the step's title becomes the
            // visible "step" in a flat layout.
            if (flat) {
              if (!showSteps || derivedStep.isTerminalStepGroup) return null

              return derivedStep.visited.map(v => {
                const CardComponent = flow.steps[v.stepId]?.component
                const cardStatus = cardStatusMap.get(v.stepId)
                if (!CardComponent || !cardStatus) return null

                return (
                  <Stepper.Step
                    key={v.stepId}
                    value={v.stepId}
                    title={flow.steps[v.stepId]?.title}
                    description={flow.steps[v.stepId]?.description}
                    state={v.state}
                    visualCompleted={flow.steps[v.stepId]?.visualCompleted}
                    showStepBadge={showStepBadge}
                    totalStepsOverride={totalStepsCount}
                  >
                    <div data-card-id={v.stepId}>
                      <CardContextProvider stepId={v.stepId} status={cardStatus} contentOnly>
                        <CardComponent />
                      </CardContextProvider>
                    </div>
                  </Stepper.Step>
                )
              })
            }

            return (
              <Stepper.StepGroup
                key={derivedStep.stepGroupId}
                value={derivedStep.stepGroupId}
                title={derivedStep.title}
                description={derivedStep.description}
                state={derivedStep.state}
                hasNestedSteps={false}
                showStepBadge={showStepBadge}
                totalStepsOverride={totalStepGroupsCount}
              >
                {showSteps &&
                  !derivedStep.isTerminalStepGroup &&
                  derivedStep.visited.map(v => {
                    const CardComponent = flow.steps[v.stepId]?.component
                    const cardStatus = cardStatusMap.get(v.stepId)
                    if (!CardComponent || !cardStatus) return null

                    return (
                      <Stepper.Step
                        key={v.stepId}
                        value={v.stepId}
                        title={flow.steps[v.stepId]?.title}
                        description={flow.steps[v.stepId]?.description}
                        state={v.state}
                        visualCompleted={flow.steps[v.stepId]?.visualCompleted}
                      >
                        <div data-card-id={v.stepId}>
                          <CardContextProvider stepId={v.stepId} status={cardStatus} contentOnly>
                            <CardComponent />
                          </CardContextProvider>
                        </div>
                      </Stepper.Step>
                    )
                  })}
              </Stepper.StepGroup>
            )
          })}
        </Stepper.Root>
      </div>
    </div>
  )
}
