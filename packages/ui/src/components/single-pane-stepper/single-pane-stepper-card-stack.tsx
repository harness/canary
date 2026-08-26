import { useCallback, useEffect, useRef } from 'react'

import { CardContextProvider, useEngineContext } from '../flow-stepper/engine'
import { FlowStepperRail } from '../flow-stepper/flow-stepper-rail'
import { useFlowStepperRailModel } from '../flow-stepper/use-flow-stepper-rail-model'
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
  hideUpcomingGroups?: boolean
  hidePredictedSteps?: boolean
}

export function SinglePaneStepperCardStack({
  stepperTitle,
  showStepperHeader,
  contentTitle,
  contentSubtitle,
  showStepBadge,
  hideUpcomingGroups,
  hidePredictedSteps
}: SinglePaneStepperCardStackProps) {
  const { flow, cardHistory, activeStepId, predictedPath, registerScrollToCard, disableAutoScroll } = useEngineContext()
  const { totalOverride, stepNumberOverrides, stepNumberOverridesComplete, handleStepperClick } =
    useFlowStepperRailModel()
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
          stepNumberOverridesComplete={stepNumberOverridesComplete}
          collapsibleNestedSteps
          hideUpcomingGroups={hideUpcomingGroups}
          hidePredictedSteps={hidePredictedSteps}
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
