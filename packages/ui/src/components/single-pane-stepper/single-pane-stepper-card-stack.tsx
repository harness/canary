import { useCallback, useEffect, useMemo, useRef } from 'react'

import { CardContextProvider, deriveFullPredictedPath, useEngineContext } from '../flow-stepper/engine'
import { FlowStepperRail } from '../flow-stepper/flow-stepper-rail'
import { Layout } from '../layout'
import { Text } from '../text'

interface SinglePaneStepperCardStackProps {
  stepperTitle?: string
  showStepperHeader?: boolean
  contentTitle?: string
  contentSubtitle?: string
  /** When true, renders a "Step {n}/{total}" pill badge next to each step's title. Default false —
   * purely opt-in, no rendering change for existing consumers that don't pass it. */
  showStepBadge?: boolean
}

export function SinglePaneStepperCardStack({
  stepperTitle,
  showStepperHeader,
  contentTitle,
  contentSubtitle,
  showStepBadge
}: SinglePaneStepperCardStackProps) {
  const { flow, cardHistory, activeStepId, predictedPath, registerScrollToCard, scrollToCard, disableAutoScroll } =
    useEngineContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(activeStepId)
  activeRef.current = activeStepId

  const scrollToCardLocal = useCallback(
    (stepId: string) => {
      // Consumers can disable all programmatic scroll (completed/review flows) — the timeline then
      // renders from the top and stays put; only user scrolls.
      if (disableAutoScroll) return
      const container = containerRef.current
      if (!container) return
      const cardEl = container.querySelector(`[data-card-id="${stepId}"]`) as HTMLElement | null
      if (!cardEl) return
      const containerRect = container.getBoundingClientRect()
      const cardRect = cardEl.getBoundingClientRect()
      const offset = cardRect.top - containerRect.top + container.scrollTop
      // scrollTo is unavailable in JSDOM — guard so tests don't throw.
      if (container.scrollTo) {
        container.scrollTo({ top: Math.max(0, offset - 16), behavior: 'smooth' })
      } else {
        container.scrollTop = Math.max(0, offset - 16)
      }
    },
    [disableAutoScroll]
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

  // Badge denominators below must reflect only the path THIS run will actually walk, not every
  // step configured in the flow. `flow.steps` is a flat map of EVERY step across EVERY branch —
  // real flows branch heavily (e.g. mutually-exclusive auth-provider or infra-setup steps all
  // converge on a shared next step), and a run only ever traverses one branch. Using
  // `Object.keys(flow.steps).length` as the denominator overcounts steps NOT on this run's
  // path, so the badge could never reach n/n. `deriveFullPredictedPath` walks the same `next`-pointer
  // chain as `predictedPath` (engine-context.tsx) but doesn't stop at step-group boundaries, giving
  // the full remainder of THIS run's path from the active step to the flow's terminal step.
  const { path: fullPredictedPath, reachedKnownEnd } = useMemo(
    () => deriveFullPredictedPath(flow, cardHistory, activeStepId),
    [flow, cardHistory, activeStepId]
  )

  // Flat mode's badge denominator: individual steps already visited plus individual steps still
  // ahead on the run's actual path. When the walk couldn't confirm the true end of the run's path
  // (the active step's real destination is decided dynamically at runtime — see
  // deriveFullPredictedPath's doc comment), never let the denominator collapse below what's already
  // known; fall back to the flow-wide step count instead of undercounting.
  const totalStepsCount = useMemo(() => {
    const walkedTotal = cardHistory.length + fullPredictedPath.length
    if (reachedKnownEnd) return walkedTotal
    return Math.max(walkedTotal, Object.keys(flow.steps).length)
  }, [cardHistory.length, fullPredictedPath.length, reachedKnownEnd, flow.steps])

  // Per-group numerator for the badge: each group's 1-based position in the ORDER the run
  // actually encounters it (cardHistory first, then the predicted remainder) — not the raw
  // rendering index, which would also count off-path mutually-exclusive sibling groups. Groups
  // never encountered on the run's path (truly off-path siblings) are absent from this map;
  // FlowStepperRail suppresses that group's badge entirely rather than showing a fallback number,
  // since a badge for a path this run never walks would be inherently misleading (see
  // flow-stepper-rail.tsx's stepGroupHasNumber check).
  const stepNumberOverrides = useMemo(() => {
    const seen = new Set<string>()
    const orderedIds: string[] = []
    for (const entry of cardHistory) {
      const stepGroupId = flow.steps[entry.stepId]?.step
      if (stepGroupId && !seen.has(stepGroupId)) {
        seen.add(stepGroupId)
        orderedIds.push(stepGroupId)
      }
    }
    for (const stepId of fullPredictedPath) {
      const stepGroupId = flow.steps[stepId]?.step
      if (stepGroupId && !seen.has(stepGroupId)) {
        seen.add(stepGroupId)
        orderedIds.push(stepGroupId)
      }
    }
    return new Map(orderedIds.map((id, index) => [id, index + 1]))
  }, [cardHistory, fullPredictedPath, flow.steps])

  // Grouped-mode denominator: same fallback-rather-than-undercount rule as totalStepsCount above,
  // one level up (distinct step GROUPS on the run's path, not steps). Derived from
  // stepNumberOverrides.size — not a separate walk — so the numerator (each group's entry in that
  // map) and this denominator can never drift out of sync with each other again.
  const totalStepGroupsCount = useMemo(() => {
    const walkedTotal = stepNumberOverrides.size
    if (reachedKnownEnd) return walkedTotal
    return Math.max(walkedTotal, Object.keys(flow.stepGroups ?? {}).length)
  }, [stepNumberOverrides, reachedKnownEnd, flow.stepGroups])

  const totalOverride = flow.stepGroups ? totalStepGroupsCount : totalStepsCount

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

        <FlowStepperRail
          flow={flow}
          cardHistory={cardHistory}
          activeStepId={activeStepId}
          predictedPath={predictedPath}
          value={activeStepId}
          onValueChange={handleStepperClick}
          stepperTitle={stepperTitle}
          showStepperHeader={showStepperHeader}
          showStepBadge={showStepBadge}
          totalOverride={totalOverride}
          stepNumberOverrides={stepNumberOverrides}
          collapsibleNestedSteps
          renderStepContent={(stepId, status) => {
            const CardComponent = flow.steps[stepId]?.component
            if (!CardComponent) return null

            return (
              <div data-card-id={stepId}>
                <CardContextProvider stepId={stepId} status={status} contentOnly>
                  <CardComponent />
                </CardContextProvider>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
