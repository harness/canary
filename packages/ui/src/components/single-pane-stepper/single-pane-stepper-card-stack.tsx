import { useCallback, useEffect, useMemo, useRef } from 'react'

import { CardContextProvider, deriveStepperModel, useEngineContext } from '../flow-stepper/engine'
import { Layout } from '../layout'
import { Stepper } from '../stepper'
import { Text } from '../text'

interface SinglePaneStepperCardStackProps {
  stepperTitle?: string
  showStepperHeader?: boolean
  contentTitle?: string
  contentSubtitle?: string
}

export function SinglePaneStepperCardStack({
  stepperTitle,
  showStepperHeader,
  contentTitle,
  contentSubtitle
}: SinglePaneStepperCardStackProps) {
  const { flow, cardHistory, activeSubStepId, predictedPath, registerScrollToCard, scrollToCard, disableAutoScroll } =
    useEngineContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(activeSubStepId)
  activeRef.current = activeSubStepId

  const scrollToCardLocal = useCallback(
    (subStepId: string) => {
      // Consumers can disable all programmatic scroll (completed/review flows) — the timeline then
      // renders from the top and stays put; only the user scrolls.
      if (disableAutoScroll) return
      const container = containerRef.current
      if (!container) return
      const cardEl = container.querySelector(`[data-card-id="${subStepId}"]`) as HTMLElement | null
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
    () => deriveStepperModel(flow, cardHistory, predictedPath, activeSubStepId),
    [flow, cardHistory, predictedPath, activeSubStepId]
  )

  // Progressive disclosure: only render steps that have been reached (active, completed, or error).
  const visibleSteps = useMemo(() => derivedSteps.filter(step => step.state !== 'upcoming'), [derivedSteps])

  // Build map of subStepId -> card status from cardHistory for status prop
  const cardStatusMap = new Map(cardHistory.map(e => [e.subStepId, e.status]))

  const handleStepperClick = (value: string) => {
    const historyEntry = cardHistory.find(e => e.subStepId === value)
    if (historyEntry) {
      scrollToCard(historyEntry.subStepId)
      return
    }
    const firstInStep = cardHistory.find(e => flow.subSteps[e.subStepId]?.step === value)
    if (firstInStep) {
      scrollToCard(firstInStep.subStepId)
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
          value={activeSubStepId}
          onValueChange={handleStepperClick}
          title={showStepperHeader ? stepperTitle : undefined}
          collapsibleSubSteps
        >
          {visibleSteps.map(derivedStep => {
            const activeStepId = flow.subSteps[activeSubStepId]?.step
            const isActiveStep = activeStepId === derivedStep.stepId
            const showSubSteps = derivedStep.visited.length > 0 || isActiveStep

            return (
              <Stepper.Step
                key={derivedStep.stepId}
                value={derivedStep.stepId}
                title={derivedStep.title}
                description={derivedStep.description}
                state={derivedStep.state}
                hasSubSteps={false}
              >
                {showSubSteps &&
                  !derivedStep.isTerminalStep &&
                  derivedStep.visited.map(v => {
                    const CardComponent = flow.subSteps[v.subStepId]?.component
                    const cardStatus = cardStatusMap.get(v.subStepId)
                    if (!CardComponent || !cardStatus) return null

                    return (
                      <Stepper.SubStep
                        key={v.subStepId}
                        value={v.subStepId}
                        title={flow.subSteps[v.subStepId]?.title}
                        description={flow.subSteps[v.subStepId]?.description}
                        state={v.state}
                      >
                        <div data-card-id={v.subStepId}>
                          <CardContextProvider subStepId={v.subStepId} status={cardStatus} contentOnly>
                            <CardComponent />
                          </CardContextProvider>
                        </div>
                      </Stepper.SubStep>
                    )
                  })}
              </Stepper.Step>
            )
          })}
        </Stepper.Root>
      </div>
    </div>
  )
}
