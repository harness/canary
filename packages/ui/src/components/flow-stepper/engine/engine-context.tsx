import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'

import { CardEntry, CardStatus, DrawerResult, FlowCardContext, FlowConfig, InitialEngineState } from './engine-types'

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
  activeStepId: string
  predictedPath: string[]
  drawerState: DrawerState | null
  pendingReactivation: string | null
  complete: (stepId: string, statePatch?: Record<string, unknown>, nextStepId?: string) => void
  error: (stepId: string, nextStepId?: string) => void
  skip: (stepId: string, nextStepId?: string) => void
  openDrawer: (id: string, props?: Record<string, unknown>) => Promise<DrawerResult>
  closeDrawer: (result: DrawerResult) => void
  requestReactivation: (stepId: string) => void
  confirmReactivation: () => void
  cancelReactivation: () => void
  scrollToCard: (stepId: string) => void
  registerScrollToCard: (fn: (stepId: string) => void) => void
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
  stepId: string
  status: CardStatus
  /** When true, hide the card header — the stepper step already shows title/status (single-pane). */
  contentOnly?: boolean
}

const CardContext = createContext<CardContextValue | null>(null)

export function CardContextProvider({
  stepId,
  status,
  contentOnly,
  children
}: CardContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ stepId, status, contentOnly }), [stepId, status, contentOnly])
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
  const { stepId, status } = useCardStatus()
  const stepIdRef = useRef(stepId)
  stepIdRef.current = stepId

  const complete = useCallback(
    (statePatch?: Partial<TState>, nextStepId?: string) => {
      engine.complete(stepIdRef.current, statePatch as Record<string, unknown>, nextStepId)
    },
    [engine.complete]
  )

  const error = useCallback(
    (nextStepId?: string) => {
      engine.error(stepIdRef.current, nextStepId)
    },
    [engine.error]
  )

  const skip = useCallback(
    (nextStepId?: string) => {
      engine.skip(stepIdRef.current, nextStepId)
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
  // Host callback after Restart is confirmed. Engine state is already rewound to the target
  // step. Use this to reset consumer flow context (provider, repo, yaml, …) to that point.
  onReactivate?: (stepId: string) => void
  // When true, the panes never auto-scroll the active card into view (on mount or transition).
  // Use for completed/review/read-only flows where chasing the active card is undesirable.
  disableAutoScroll?: boolean
  // Optional resume snapshot from a host app (e.g. a browser-persisted draft). Canary does not
  // read/write storage itself — the host app validates and passes an already-usable snapshot.
  // Omitted (or unusable — see isUsableInitialEngineState) falls back to today's behavior:
  // `initialStep` active with empty `state`.
  initialEngineState?: InitialEngineState
  children: ReactNode
}

// A snapshot is only usable if it has at least one history entry and every entry's stepId is
// still present in the current flow config. A flow can change shape between app versions, so a
// stale snapshot referencing a removed/renamed step must fall back to the default seed rather
// than render a blank card for an unknown step.
function isUsableInitialEngineState(
  flow: FlowConfig,
  snapshot: InitialEngineState | undefined
): snapshot is InitialEngineState {
  if (!snapshot) return false
  if (snapshot.cardHistory.length === 0) return false
  return snapshot.cardHistory.every(entry => entry.stepId in flow.steps)
}

// Rebuilds the terminalRef re-entry guard from a restored cardHistory, mirroring the invariants
// that complete()/skip()/error() maintain live:
// - 'completed' / 'skipped' entries are always terminal (re-entry guarded).
// - a step flagged `terminal` in the flow config is terminal regardless of its history status.
// - an 'error' entry is terminal only if it is NOT the last entry in history (error-and-continue
//   already advanced past it live). A last-entry 'error' is the current recoverable position and
//   must stay retry-able.
function rebuildTerminalRef(flow: FlowConfig, history: CardEntry[]): Set<string> {
  const terminal = new Set<string>()
  history.forEach((entry, index) => {
    const isLast = index === history.length - 1
    if (entry.status === 'completed' || entry.status === 'skipped') {
      terminal.add(entry.stepId)
    }
    if (flow.steps[entry.stepId]?.terminal) {
      terminal.add(entry.stepId)
    }
    if (entry.status === 'error' && !isLast) {
      terminal.add(entry.stepId)
    }
  })
  return terminal
}

export function FlowEngineProvider({
  flow,
  onComplete,
  onReactivate,
  disableAutoScroll = false,
  initialEngineState,
  children
}: FlowEngineProviderProps) {
  const [state, setState] = useState<Record<string, unknown>>(() =>
    isUsableInitialEngineState(flow, initialEngineState) ? initialEngineState.state : {}
  )
  // Hydrated history is passed through as-is. Missing `mountGeneration` is treated as 0, so a
  // resume does not remount cards. Fresh seeds start at 0 and bump on Restart.
  const [cardHistory, setCardHistory] = useState<CardEntry[]>(() =>
    isUsableInitialEngineState(flow, initialEngineState)
      ? initialEngineState.cardHistory
      : [{ stepId: flow.initialStep, status: 'active', stateSnapshot: {}, mountGeneration: 0 }]
  )
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null)
  const [pendingReactivation, setPendingReactivation] = useState<string | null>(null)
  const scrollToCardRef = useRef<((stepId: string) => void) | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const cardHistoryRef = useRef(cardHistory)
  cardHistoryRef.current = cardHistory
  const pendingReactivationRef = useRef(pendingReactivation)
  pendingReactivationRef.current = pendingReactivation
  // Tracks steps that have reached a terminal state (completed/skipped).
  // Prevents duplicate transitions from React strict mode or async races.
  // Fresh mounts must start empty: live complete() adds the current step on first
  // transition, and adds a *next* terminal step only when navigating onto it.
  // Rebuilding from the default `{ initialStep, active }` seed would mark a
  // terminal initial step as already done, so the first complete() takes the
  // re-entry path and never paints completed.
  const terminalRef = useRef<Set<string>>(
    isUsableInitialEngineState(flow, initialEngineState)
      ? rebuildTerminalRef(flow, initialEngineState.cardHistory)
      : new Set()
  )

  // Derived: active step
  const activeStepId = useMemo(() => {
    const active = cardHistory.find(e => e.status === 'active')
    if (active) return active.stepId
    // Flow complete — use last card in history
    return cardHistory[cardHistory.length - 1]?.stepId || flow.initialStep
  }, [cardHistory, flow.initialStep])

  // Derived: predicted happy path (within the active step's step group only)
  const predictedPath = useMemo(() => {
    const activeStepGroupId = flow.steps[activeStepId]?.step
    const predicted: string[] = []
    let current = flow.steps[activeStepId]?.next
    const visited = new Set(cardHistory.map(e => e.stepId))
    while (current && flow.steps[current] && !visited.has(current) && flow.steps[current].step === activeStepGroupId) {
      predicted.push(current)
      current = flow.steps[current].next
    }
    return predicted
  }, [activeStepId, cardHistory, flow.steps])

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

  // Resolve the next step for a transition and validate it exists. A dynamic `nextStepId`
  // (passed to complete()/skip()) is only known at call time, so it escapes any static config
  // check — a typo'd or stale target would otherwise push a phantom cardHistory entry that renders
  // a blank card and silently dead-ends the flow. Here we surface it as a console error and treat
  // it as "no next", so the misconfiguration is loud during development instead of a mystery blank
  // step. A resolved static `next` is trusted (it was declared in the flow config).
  const resolveNextStep = useCallback(
    (stepId: string, nextStepId: string | undefined, op: 'complete' | 'skip' | 'error'): string | undefined => {
      const resolvedNext = nextStepId || flow.steps[stepId]?.next
      if (resolvedNext && !flow.steps[resolvedNext]) {
        // eslint-disable-next-line no-console
        console.error(
          `[flow-stepper] ${op}() from "${stepId}" targeted unknown step "${resolvedNext}". ` +
            `Check the flow config and the nextStepId passed to ${op}(). Ignoring the transition.`
        )
        return undefined
      }
      return resolvedNext
    },
    [flow.steps]
  )

  const complete = useCallback(
    (stepId: string, statePatch?: Record<string, unknown>, nextStepId?: string) => {
      // Re-entry on a terminal step with no further destination:
      // the card is signaling "user is done with the flow."
      if (terminalRef.current.has(stepId)) {
        if (!nextStepId && !flow.steps[stepId]?.next) {
          onComplete?.(stateRef.current)
        }
        return
      }
      terminalRef.current.add(stepId)

      const resolvedNext = resolveNextStep(stepId, nextStepId, 'complete')
      const currentState = stateRef.current
      const newState = statePatch ? { ...currentState, ...statePatch } : currentState
      if (statePatch) setState(newState)

      setCardHistory(prev => {
        const updated = prev.map(entry =>
          entry.stepId === stepId ? { ...entry, status: 'completed' as const, stateSnapshot: newState } : entry
        )
        if (resolvedNext && !updated.find(e => e.stepId === resolvedNext)) {
          // Terminal only blocks re-entry (added to terminalRef below); it no longer forces
          // 'completed' status on entry — visual completion is now `visualCompleted`'s job.
          if (flow.steps[resolvedNext]?.terminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            stepId: resolvedNext,
            status: 'active',
            stateSnapshot: newState,
            mountGeneration: 0
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.steps, onComplete, resolveNextStep]
  )

  const error = useCallback(
    (stepId: string, nextStepId?: string) => {
      // Only interactive states (active, error) can transition to error.
      // Terminal states (completed, skipped) are locked.
      if (terminalRef.current.has(stepId)) return

      // Without a next target this is a plain error: mark the step red and leave it as the
      // active/error position (recoverable — the card can retry, which re-enters and transitions).
      if (!nextStepId) {
        setCardHistory(prev =>
          prev.map(entry => (entry.stepId === stepId ? { ...entry, status: 'error' as const } : entry))
        )
        return
      }

      // Error-and-continue: the step failed but the flow proceeds to `nextStepId`. The errored
      // step is locked (terminal) so it stays red in history while the flow advances — mirrors a
      // real "step failed, moved on" path. Structure matches skip(), with `error` status instead.
      terminalRef.current.add(stepId)
      const resolvedNext = resolveNextStep(stepId, nextStepId, 'error')

      setCardHistory(prev => {
        const updated = prev.map(entry => (entry.stepId === stepId ? { ...entry, status: 'error' as const } : entry))
        if (resolvedNext && !updated.find(e => e.stepId === resolvedNext)) {
          if (flow.steps[resolvedNext]?.terminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            stepId: resolvedNext,
            status: 'active',
            stateSnapshot: stateRef.current,
            mountGeneration: 0
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.steps, resolveNextStep]
  )

  const skip = useCallback(
    (stepId: string, nextStepId?: string) => {
      if (terminalRef.current.has(stepId)) return
      terminalRef.current.add(stepId)

      const resolvedNext = resolveNextStep(stepId, nextStepId, 'skip')

      setCardHistory(prev => {
        const updated = prev.map(entry => (entry.stepId === stepId ? { ...entry, status: 'skipped' as const } : entry))
        if (resolvedNext && !updated.find(e => e.stepId === resolvedNext)) {
          if (flow.steps[resolvedNext]?.terminal) {
            terminalRef.current.add(resolvedNext)
          }
          updated.push({
            stepId: resolvedNext,
            status: 'active',
            stateSnapshot: stateRef.current,
            mountGeneration: 0
          })
        }
        return updated
      })

      if (resolvedNext) {
        setTimeout(() => scrollToCardRef.current?.(resolvedNext), 150)
      }
    },
    [flow.steps, resolveNextStep]
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

  const requestReactivation = useCallback((stepId: string) => {
    setPendingReactivation(stepId)
  }, [])

  const confirmReactivation = useCallback(() => {
    const target = pendingReactivationRef.current
    if (!target) return
    const history = cardHistoryRef.current
    const targetIndex = history.findIndex(e => e.stepId === target)
    if (targetIndex < 0) return

    const prevSnapshot = targetIndex > 0 ? history[targetIndex - 1].stateSnapshot : {}

    setState(prevSnapshot)
    setCardHistory(prev => {
      const trimmed = prev.slice(0, targetIndex + 1)
      return trimmed.map((entry, idx) =>
        idx === targetIndex
          ? {
              ...entry,
              status: 'active' as const,
              // Bump so card stacks remount this card's local state (collapse still uses forceMount).
              mountGeneration: (entry.mountGeneration ?? 0) + 1
            }
          : entry
      )
    })

    for (const entry of history.slice(targetIndex)) {
      terminalRef.current.delete(entry.stepId)
    }
    setPendingReactivation(null)
    onReactivate?.(target)

    setTimeout(() => scrollToCardRef.current?.(target), 150)
  }, [onReactivate])

  const cancelReactivation = useCallback(() => {
    setPendingReactivation(null)
  }, [])

  const scrollToCard = useCallback((stepId: string) => {
    scrollToCardRef.current?.(stepId)
  }, [])

  const registerScrollToCard = useCallback((fn: (stepId: string) => void) => {
    scrollToCardRef.current = fn
  }, [])

  // === Context Value ===

  const contextValue = useMemo<EngineContextValue>(
    () => ({
      flow,
      state,
      cardHistory,
      activeStepId,
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
      activeStepId,
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
