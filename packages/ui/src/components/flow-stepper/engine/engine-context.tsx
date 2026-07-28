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
  error: (subStepId: string, nextSubStepId?: string) => void
  skip: (subStepId: string, nextSubStepId?: string) => void
  openDrawer: (id: string, props?: Record<string, unknown>) => Promise<DrawerResult>
  closeDrawer: (result: DrawerResult) => void
  requestReactivation: (subStepId: string) => void
  confirmReactivation: () => void
  cancelReactivation: () => void
  scrollToCard: (subStepId: string) => void
  registerScrollToCard: (fn: (subStepId: string) => void) => void
  disableAutoScroll: boolean
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
  /** When true, hide the card header — the stepper substep already shows title/status (single-pane). */
  contentOnly?: boolean
}

const CardContext = createContext<CardContextValue | null>(null)

export function CardContextProvider({
  subStepId,
  status,
  contentOnly,
  children
}: CardContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ subStepId, status, contentOnly }), [subStepId, status, contentOnly])
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

  const error = useCallback(
    (nextSubStepId?: string) => {
      engine.error(subStepIdRef.current, nextSubStepId)
    },
    [engine.error]
  )

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
  // When true, the panes never auto-scroll the active card into view (on mount or transition).
  // Use for completed/review/read-only flows where chasing the active card is undesirable.
  disableAutoScroll?: boolean
  children: ReactNode
}

export function FlowEngineProvider({ flow, onComplete, disableAutoScroll = false, children }: FlowEngineProviderProps) {
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

  // Resolve the next substep for a transition and validate it exists. A dynamic `nextSubStepId`
  // (passed to complete()/skip()) is only known at call time, so it escapes any static config
  // check — a typo'd or stale target would otherwise push a phantom cardHistory entry that renders
  // a blank card and silently dead-ends the flow. Here we surface it as a console error and treat
  // it as "no next", so the misconfiguration is loud during development instead of a mystery blank
  // step. A resolved static `next` is trusted (it was declared in the flow config).
  const resolveNextSubStep = useCallback(
    (subStepId: string, nextSubStepId: string | undefined, op: 'complete' | 'skip' | 'error'): string | undefined => {
      const resolvedNext = nextSubStepId || flow.subSteps[subStepId]?.next
      if (resolvedNext && !flow.subSteps[resolvedNext]) {
        // eslint-disable-next-line no-console
        console.error(
          `[flow-stepper] ${op}() from "${subStepId}" targeted unknown substep "${resolvedNext}". ` +
            `Check the flow config and the nextSubStepId passed to ${op}(). Ignoring the transition.`
        )
        return undefined
      }
      return resolvedNext
    },
    [flow.subSteps]
  )

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

      const resolvedNext = resolveNextSubStep(subStepId, nextSubStepId, 'complete')
      const currentState = stateRef.current
      const newState = statePatch ? { ...currentState, ...statePatch } : currentState
      if (statePatch) setState(newState)

      setCardHistory(prev => {
        const updated = prev.map(entry =>
          entry.subStepId === subStepId ? { ...entry, status: 'completed' as const, stateSnapshot: newState } : entry
        )
        if (resolvedNext && !updated.find(e => e.subStepId === resolvedNext)) {
          // Terminal only blocks re-entry (added to terminalRef below); it no longer forces
          // 'completed' status on entry — visual completion is now `visualCompleted`'s job.
          if (flow.subSteps[resolvedNext]?.terminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            subStepId: resolvedNext,
            status: 'active',
            stateSnapshot: newState
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.subSteps, onComplete, resolveNextSubStep]
  )

  const error = useCallback(
    (subStepId: string, nextSubStepId?: string) => {
      // Only interactive states (active, error) can transition to error.
      // Terminal states (completed, skipped) are locked.
      if (terminalRef.current.has(subStepId)) return

      // Without a next target this is a plain error: mark the substep red and leave it as the
      // active/error position (recoverable — the card can retry, which re-enters and transitions).
      if (!nextSubStepId) {
        setCardHistory(prev =>
          prev.map(entry => (entry.subStepId === subStepId ? { ...entry, status: 'error' as const } : entry))
        )
        return
      }

      // Error-and-continue: the substep failed but the flow proceeds to `nextSubStepId`. The errored
      // substep is locked (terminal) so it stays red in history while the flow advances — mirrors a
      // real "step failed, moved on" path. Structure matches skip(), with `error` status instead.
      terminalRef.current.add(subStepId)
      const resolvedNext = resolveNextSubStep(subStepId, nextSubStepId, 'error')

      setCardHistory(prev => {
        const updated = prev.map(entry =>
          entry.subStepId === subStepId ? { ...entry, status: 'error' as const } : entry
        )
        if (resolvedNext && !updated.find(e => e.subStepId === resolvedNext)) {
          if (flow.subSteps[resolvedNext]?.terminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            subStepId: resolvedNext,
            status: 'active',
            stateSnapshot: stateRef.current
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.subSteps, resolveNextSubStep]
  )

  const skip = useCallback(
    (subStepId: string, nextSubStepId?: string) => {
      if (terminalRef.current.has(subStepId)) return
      terminalRef.current.add(subStepId)

      const resolvedNext = resolveNextSubStep(subStepId, nextSubStepId, 'skip')

      setCardHistory(prev => {
        const updated = prev.map(entry =>
          entry.subStepId === subStepId ? { ...entry, status: 'skipped' as const } : entry
        )
        if (resolvedNext && !updated.find(e => e.subStepId === resolvedNext)) {
          if (flow.subSteps[resolvedNext]?.terminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            subStepId: resolvedNext,
            status: 'active',
            stateSnapshot: stateRef.current
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.subSteps, resolveNextSubStep]
  )

  const openDrawer = useCallback((id: string, props?: Record<string, unknown>): Promise<DrawerResult> => {
    return new Promise<DrawerResult>(resolve => {
      setDrawerState({ id, props, resolve })
    })
  }, [])

  const drawerStateRef = useRef(drawerState)
  drawerStateRef.current = drawerState

  const closeDrawer = useCallback((result: DrawerResult) => {
    // Idempotent: resolve the openDrawer promise at most once. Adapters may route confirm and
    // dismiss through a single close handler that can fire twice in one tick (e.g. a synchronous
    // form-submit followed by the drawer's own close callback); the second call must be a no-op
    // rather than settle the (already-settled) promise a second time or clear a fresh drawer.
    // We null the ref SYNCHRONOUSLY here — setDrawerState(null) only updates drawerStateRef on the
    // next render, so a same-tick second call would otherwise still see the stale resolver.
    const current = drawerStateRef.current
    if (!current) return
    drawerStateRef.current = null
    current.resolve(result)
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
      registerScrollToCard,
      disableAutoScroll
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
      registerScrollToCard,
      disableAutoScroll
    ]
  )

  return <EngineContext.Provider value={contextValue}>{children}</EngineContext.Provider>
}
