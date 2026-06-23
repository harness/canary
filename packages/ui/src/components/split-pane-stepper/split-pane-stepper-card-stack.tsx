import { useCallback, useEffect, useRef } from 'react'

import { CardContextProvider, useEngineContext } from './split-pane-stepper-context'

export function SplitPaneStepperCardStack() {
  const { flow, cardHistory, activeSubStepId, registerScrollToCard } = useEngineContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(activeSubStepId)
  activeRef.current = activeSubStepId

  const scrollToCard = useCallback((subStepId: string) => {
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
  }, [])

  useEffect(() => {
    registerScrollToCard(scrollToCard)
  }, [registerScrollToCard, scrollToCard])

  useEffect(() => {
    if (activeRef.current) {
      setTimeout(() => scrollToCard(activeRef.current), 50)
    }
  }, [])

  return (
    <div ref={containerRef} className="cn-split-pane-stepper-card-stack">
      <div className="cn-split-pane-stepper-card-stack-inner">
        {cardHistory.map(entry => {
          const config = flow.subSteps[entry.subStepId]
          if (!config) return null
          const CardComponent = config.component
          return (
            <div key={entry.subStepId} data-card-id={entry.subStepId}>
              <CardContextProvider subStepId={entry.subStepId} status={entry.status}>
                <CardComponent />
              </CardContextProvider>
            </div>
          )
        })}
      </div>
    </div>
  )
}
