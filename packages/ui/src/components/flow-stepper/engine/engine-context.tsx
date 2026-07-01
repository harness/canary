import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'

import { CardEntry, CardStatus, DrawerResult, FlowCardContext, FlowConfig } from './engine-types'

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
  skip: (subStepId: string, nextSubStepId?: string) => void
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
  if (!ctx)
    throw new Error(
      'useEngineContext must be used within a flow stepper Root (DualPaneStepper.Root or SinglePaneStepper.Root)'
    )
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
  if (!ctx)
    throw new Error(
      'useCardStatus must be used within a card rendered by a flow stepper (DualPaneStepper or SinglePaneStepper)'
    )
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
    (nextSubStepId?: string) => {
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
  onComplete?: (state: Record<string, unknown>) => void
  children: ReactNode
}

export function FlowEngineProvider({ flow, onComplete, children }: FlowEngineProviderProps) {
  const [state, setState] = useState<Record<string, unknown>>({})
  const [cardHistory, setCardHistory] = useState<CardEntry[]>([
    { subStepId: flow.initialSubStep, status: 'active', stateSnapshot: {} }
  ])
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null)
  const [pendingReactivation, setPendingReactivation] = useState<string | null>(null)
  const scrollToCardRef = useRef<((subStepId: string) => void) | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const cardHistoryRef = useRef(cardHistory)
  cardHistoryRef.current = cardHistory
  const pendingReactivationRef = useRef(pendingReactivation)
  pendingReactivationRef.current = pendingReactivation
  // Tracks substeps that have reached a terminal state (completed/skipped).
  // Prevents duplicate transitions from React strict mode or async races.
  const terminalRef = useRef<Set<string>>(new Set())

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
  //
  // State machine transitions:
  //   active  → completed (via complete)
  //   active  → skipped   (via skip)
  //   active  → error     (via error)
  //   error   → completed (via complete)
  //   error   → skipped   (via skip)
  //   error   → error     (via error, idempotent)
  //
  // Terminal states (completed, skipped) reject all further transitions.

  const complete = useCallback(
    (subStepId: string, statePatch?: Record<string, unknown>, nextSubStepId?: string) => {
      // Re-entry on a terminal substep with no further destination:
      // the card is signaling "user is done with the flow."
      if (terminalRef.current.has(subStepId)) {
        if (!nextSubStepId && !flow.subSteps[subStepId]?.next) {
          onComplete?.(stateRef.current)
        }
        return
      }
      terminalRef.current.add(subStepId)

      const resolvedNext = nextSubStepId || flow.subSteps[subStepId]?.next
      const currentState = stateRef.current
      const newState = statePatch ? { ...currentState, ...statePatch } : currentState
      if (statePatch) setState(newState)

      setCardHistory(prev => {
        const updated = prev.map(entry =>
          entry.subStepId === subStepId ? { ...entry, status: 'completed' as const, stateSnapshot: newState } : entry
        )
        if (resolvedNext && !updated.find(e => e.subStepId === resolvedNext)) {
          // Terminal substeps enter as completed — the card renders in "finished" state
          // immediately without consumer-side useEffect. The user's explicit complete()
          // re-entry then fires onComplete to exit the flow.
          const isNextTerminal = flow.subSteps[resolvedNext]?.terminal
          if (isNextTerminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            subStepId: resolvedNext,
            status: isNextTerminal ? 'completed' : 'active',
            stateSnapshot: newState
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.subSteps, onComplete]
  )

  const error = useCallback((subStepId: string) => {
    // Only interactive states (active, error) can transition to error.
    // Terminal states (completed, skipped) are locked.
    if (terminalRef.current.has(subStepId)) return
    setCardHistory(prev =>
      prev.map(entry => (entry.subStepId === subStepId ? { ...entry, status: 'error' as const } : entry))
    )
  }, [])

  const skip = useCallback(
    (subStepId: string, nextSubStepId?: string) => {
      if (terminalRef.current.has(subStepId)) return
      terminalRef.current.add(subStepId)

      const resolvedNext = nextSubStepId || flow.subSteps[subStepId]?.next

      setCardHistory(prev => {
        const updated = prev.map(entry =>
          entry.subStepId === subStepId ? { ...entry, status: 'skipped' as const } : entry
        )
        if (resolvedNext && !updated.find(e => e.subStepId === resolvedNext)) {
          const isNextTerminal = flow.subSteps[resolvedNext]?.terminal
          if (isNextTerminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            subStepId: resolvedNext,
            status: isNextTerminal ? 'completed' : 'active',
            stateSnapshot: stateRef.current
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.subSteps]
  )

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
    const target = pendingReactivationRef.current
    if (!target) return
    const history = cardHistoryRef.current
    const targetIndex = history.findIndex(e => e.subStepId === target)
    if (targetIndex < 0) return

    const prevSnapshot = targetIndex > 0 ? history[targetIndex - 1].stateSnapshot : {}

    setState(prevSnapshot)
    setCardHistory(prev => {
      const trimmed = prev.slice(0, targetIndex + 1)
      return trimmed.map((entry, idx) => (idx === targetIndex ? { ...entry, status: 'active' as const } : entry))
    })

    for (const entry of history.slice(targetIndex)) {
      terminalRef.current.delete(entry.subStepId)
    }
    setPendingReactivation(null)

    setTimeout(() => scrollToCardRef.current?.(target), 150)
  }, [])

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
