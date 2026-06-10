import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'

import { CardEntry, CardStatus, DrawerResult, FlowCardContext, FlowConfig } from './split-pane-stepper-types'

// === Engine Context ===

interface DrawerState {
  id: string
  props?: Record<string, unknown>
  resolve: (result: DrawerResult) => void
}

interface EngineContextValue {
  flow: FlowConfig
  state: Record<string, unknown>
  cardHistory: CardEntry[]
  activeSubStepId: string
  predictedPath: string[]
  drawerState: DrawerState | null
  pendingReactivation: string | null
  complete: (subStepId: string, statePatch?: Record<string, unknown>, nextSubStepId?: string) => void
  error: (subStepId: string) => void
  skip: (subStepId: string, nextSubStepId: string) => void
  openDrawer: (id: string, props?: Record<string, unknown>) => Promise<DrawerResult>
  closeDrawer: (result: DrawerResult) => void
  requestReactivation: (subStepId: string) => void
  confirmReactivation: () => void
  cancelReactivation: () => void
  scrollToCard: (subStepId: string) => void
  registerScrollToCard: (fn: (subStepId: string) => void) => void
}

const EngineContext = createContext<EngineContextValue | null>(null)

export function useEngineContext(): EngineContextValue {
  const ctx = useContext(EngineContext)
  if (!ctx) throw new Error('useEngineContext must be used within SplitPaneStepper.Root')
  return ctx
}

// === Card Context (per-card wrapper) ===

interface CardContextValue {
  subStepId: string
  status: CardStatus
}

const CardContext = createContext<CardContextValue | null>(null)

export function CardContextProvider({ subStepId, status, children }: CardContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ subStepId, status }), [subStepId, status])
  return <CardContext.Provider value={value}>{children}</CardContext.Provider>
}

export function useCardStatus(): CardContextValue {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error('useCardStatus must be used within a card rendered by SplitPaneStepper')
  return ctx
}

// === Public Hook ===

export function useFlowCard<TState = Record<string, unknown>>(): FlowCardContext<TState> {
  const engine = useEngineContext()
  const { subStepId, status } = useCardStatus()
  const subStepIdRef = useRef(subStepId)
  subStepIdRef.current = subStepId

  const complete = useCallback(
    (statePatch?: Partial<TState>, nextSubStepId?: string) => {
      engine.complete(subStepIdRef.current, statePatch as Record<string, unknown>, nextSubStepId)
    },
    [engine.complete]
  )

  const error = useCallback(() => {
    engine.error(subStepIdRef.current)
  }, [engine.error])

  const skip = useCallback(
    (nextSubStepId: string) => {
      engine.skip(subStepIdRef.current, nextSubStepId)
    },
    [engine.skip]
  )

  return useMemo(
    () => ({
      state: engine.state as TState,
      status,
      complete,
      error,
      skip,
      openDrawer: engine.openDrawer
    }),
    [engine.state, status, complete, error, skip, engine.openDrawer]
  )
}

// === Engine Provider ===

interface FlowEngineProviderProps {
  flow: FlowConfig
  children: ReactNode
}

export function FlowEngineProvider({ flow, children }: FlowEngineProviderProps) {
  const [state, setState] = useState<Record<string, unknown>>({})
  const [cardHistory, setCardHistory] = useState<CardEntry[]>([
    { subStepId: flow.initialSubStep, status: 'active', stateSnapshot: {} }
  ])
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null)
  const [pendingReactivation, setPendingReactivation] = useState<string | null>(null)
  const scrollToCardRef = useRef<((subStepId: string) => void) | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const completedRef = useRef<Set<string>>(new Set())

  // Derived: active substep
  const activeSubStepId = useMemo(() => {
    const active = cardHistory.find(e => e.status === 'active')
    if (active) return active.subStepId
    // Flow complete — use last card in history
    return cardHistory[cardHistory.length - 1]?.subStepId || flow.initialSubStep
  }, [cardHistory, flow.initialSubStep])

  // Derived: predicted happy path (within active step only)
  const predictedPath = useMemo(() => {
    const activeStep = flow.subSteps[activeSubStepId]?.step
    const predicted: string[] = []
    let current = flow.subSteps[activeSubStepId]?.next
    const visited = new Set(cardHistory.map(e => e.subStepId))
    while (current && flow.subSteps[current] && !visited.has(current) && flow.subSteps[current].step === activeStep) {
      predicted.push(current)
      current = flow.subSteps[current].next
    }
    return predicted
  }, [activeSubStepId, cardHistory, flow.subSteps])

  // === Actions ===

  const complete = useCallback(
    (subStepId: string, statePatch?: Record<string, unknown>, nextSubStepId?: string) => {
      if (completedRef.current.has(subStepId)) return
      completedRef.current.add(subStepId)

      const resolvedNext = nextSubStepId || flow.subSteps[subStepId]?.next
      const currentState = stateRef.current
      const newState = statePatch ? { ...currentState, ...statePatch } : currentState
      if (statePatch) setState(newState)

      setCardHistory(prev => {
        const updated = prev.map(entry =>
          entry.subStepId === subStepId ? { ...entry, status: 'completed' as const, stateSnapshot: newState } : entry
        )
        if (resolvedNext && !updated.find(e => e.subStepId === resolvedNext)) {
          updated.push({ subStepId: resolvedNext, status: 'active', stateSnapshot: newState })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.subSteps]
  )

  const error = useCallback((subStepId: string) => {
    setCardHistory(prev =>
      prev.map(entry => (entry.subStepId === subStepId ? { ...entry, status: 'error' as const } : entry))
    )
  }, [])

  const skip = useCallback((subStepId: string, nextSubStepId: string) => {
    if (completedRef.current.has(subStepId)) return
    completedRef.current.add(subStepId)

    setCardHistory(prev => {
      const current = prev.find(e => e.subStepId === subStepId)
      const newStatus: CardStatus = current?.status === 'error' ? 'error' : 'skipped'
      const updated = prev.map(entry => (entry.subStepId === subStepId ? { ...entry, status: newStatus } : entry))
      if (!updated.find(e => e.subStepId === nextSubStepId)) {
        updated.push({ subStepId: nextSubStepId, status: 'active', stateSnapshot: stateRef.current })
      }
      return updated
    })

    setTimeout(() => scrollToCardRef.current?.(nextSubStepId), 150)
  }, [])

  const openDrawer = useCallback((id: string, props?: Record<string, unknown>): Promise<DrawerResult> => {
    return new Promise<DrawerResult>(resolve => {
      setDrawerState({ id, props, resolve })
    })
  }, [])

  const drawerStateRef = useRef(drawerState)
  drawerStateRef.current = drawerState

  const closeDrawer = useCallback((result: DrawerResult) => {
    if (drawerStateRef.current?.resolve) {
      drawerStateRef.current.resolve(result)
    }
    setDrawerState(null)
  }, [])

  const requestReactivation = useCallback((subStepId: string) => {
    setPendingReactivation(subStepId)
  }, [])

  const confirmReactivation = useCallback(() => {
    if (!pendingReactivation) return
    const targetIndex = cardHistory.findIndex(e => e.subStepId === pendingReactivation)
    if (targetIndex < 0) return

    const targetEntry = cardHistory[targetIndex]
    const prevSnapshot = targetIndex > 0 ? cardHistory[targetIndex - 1].stateSnapshot : {}

    setState(prevSnapshot)
    setCardHistory(prev => {
      const trimmed = prev.slice(0, targetIndex + 1)
      return trimmed.map((entry, idx) => (idx === targetIndex ? { ...entry, status: 'active' as const } : entry))
    })

    // Allow re-completion of the reactivated card and all subsequent cards
    for (const entry of cardHistory.slice(targetIndex)) {
      completedRef.current.delete(entry.subStepId)
    }
    setPendingReactivation(null)

    setTimeout(() => scrollToCardRef.current?.(pendingReactivation), 150)
  }, [pendingReactivation, cardHistory])

  const cancelReactivation = useCallback(() => {
    setPendingReactivation(null)
  }, [])

  const scrollToCard = useCallback((subStepId: string) => {
    scrollToCardRef.current?.(subStepId)
  }, [])

  const registerScrollToCard = useCallback((fn: (subStepId: string) => void) => {
    scrollToCardRef.current = fn
  }, [])

  // === Context Value ===

  const contextValue = useMemo<EngineContextValue>(
    () => ({
      flow,
      state,
      cardHistory,
      activeSubStepId,
      predictedPath,
      drawerState,
      pendingReactivation,
      complete,
      error,
      skip,
      openDrawer,
      closeDrawer,
      requestReactivation,
      confirmReactivation,
      cancelReactivation,
      scrollToCard,
      registerScrollToCard
    }),
    [
      flow,
      state,
      cardHistory,
      activeSubStepId,
      predictedPath,
      drawerState,
      pendingReactivation,
      complete,
      error,
      skip,
      openDrawer,
      closeDrawer,
      requestReactivation,
      confirmReactivation,
      cancelReactivation,
      scrollToCard,
      registerScrollToCard
    ]
  )

  return <EngineContext.Provider value={contextValue}>{children}</EngineContext.Provider>
}
