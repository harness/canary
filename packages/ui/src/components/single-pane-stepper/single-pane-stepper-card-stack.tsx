import { useCallback, useEffect, useMemo, useRef } from 'react'

import { CardContextProvider, deriveStepperModel, useEngineContext } from '../flow-stepper/engine'
import { Stepper } from '../stepper'

interface SinglePaneStepperCardStackProps {
  stepperTitle?: string
}

export function SinglePaneStepperCardStack({ stepperTitle }: SinglePaneStepperCardStackProps) {
  const { flow, cardHistory, activeSubStepId, predictedPath, registerScrollToCard, scrollToCard } = useEngineContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(activeSubStepId)
  activeRef.current = activeSubStepId

  const scrollToCardLocal = useCallback(
    (subStepId: string) => {
      const container = containerRef.current
      if (!container) return
      const cardEl = container.querySelector(`[data-card-id="${subStepId}"]`) as HTMLElement | null
      if (!cardEl) return

      const containerRect = container.getBoundingClientRect()
      const cardRect = cardEl.getBoundingClientRect()
      const offsetTop = cardRect.top - containerRect.top + container.scrollTop
      const targetScroll = offsetTop - containerRect.height / 2 + cardRect.height / 2

      // JSDOM doesn't implement scrollTo; fall back to direct scrollTop for test environments
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' })
      } else {
        container.scrollTop = Math.max(0, targetScroll)
      }
    },
    [containerRef]
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
        <Stepper.Root value={activeSubStepId} onValueChange={handleStepperClick} title={stepperTitle}>
          {derivedSteps.map(derivedStep => {
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
                hasSubSteps={derivedStep.showIndeterminate}
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
                          <CardContextProvider subStepId={v.subStepId} status={cardStatus}>
                            <CardComponent />
                          </CardContextProvider>
                        </div>
                      </Stepper.SubStep>
                    )
                  })}
                {isActiveStep &&
                  !derivedStep.isTerminalStep &&
                  derivedStep.predicted.map(subStepId => (
                    <Stepper.SubStep
                      key={subStepId}
                      value={subStepId}
                      title={flow.subSteps[subStepId]?.title}
                      description={flow.subSteps[subStepId]?.description}
                      state="upcoming"
                    />
                  ))}
              </Stepper.Step>
            )
          })}
        </Stepper.Root>
      </div>
    </div>
  )
}
