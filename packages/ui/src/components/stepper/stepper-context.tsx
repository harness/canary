import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { StepState } from './stepper-types'

interface StepMeta {
  disabled?: boolean
  blocking?: boolean
  state?: StepState
  loading?: boolean
  // Flat-mode top-level steps can override the announced/displayed total (see stepper-step.tsx's
  // TopLevelStep) when orderedSteps.length (progressively-disclosed, currently-mounted steps) undercounts
  // the flow's real step count. Registered here so StepperLiveRegion can read the active step's own
  // override and keep the screen-reader announcement in sync with the visible "Step n/total" badge.
  totalStepsOverride?: number
}

interface StepperContextValue {
  value: string
  onValueChange: (value: string) => void
  onBeforeChange?: (from: string, to: string) => boolean | string
  showConnectors: boolean
  completed: boolean
  collapsibleNestedSteps: boolean
  orderedSteps: string[]
  nestedSteps: Map<string, string[]>
  stepMeta: Map<string, StepMeta>
  furthestReached: number
  transitioning: { sourceIndex: number; targetIndex: number } | null
  registerStep: (value: string) => () => void
  registerNestedStep: (parentValue: string, nestedStepValue: string) => () => void
  registerNestedStepState: (parentValue: string, nestedStepValue: string, state: StepState) => () => void
  registerStepMeta: (value: string, meta: StepMeta) => void
  getStepState: (value: string) => StepState
  getNestedStepState: (parentValue: string, nestedStepValue: string) => StepState
  isStepDisabled: (value: string) => boolean
  selectStep: (stepValue: string) => void
  selectNestedStep: (nestedStepValue: string) => void
  pendingNavigation: { to: string; message: string } | null
  confirmNavigation: () => void
  cancelNavigation: () => void
}

const StepperContext = createContext<StepperContextValue | null>(null)

export function useStepperContext(): StepperContextValue {
  const context = useContext(StepperContext)
  if (!context) {
    throw new Error('useStepperContext must be used within a StepperProvider')
  }
  return context
}

// Parent step context for nested steps
const ParentStepContext = createContext<string | null>(null)

export function ParentStepProvider({ value, children }: { value: string; children: ReactNode }) {
  return <ParentStepContext.Provider value={value}>{children}</ParentStepContext.Provider>
}

// Returns null when there's no ancestor ParentStepProvider — this is a valid, non-error state. A
// Step rendered directly under Stepper.Root (no StepGroup wrapper) has no parent, and callers use
// the null return to switch to top-level registration/rendering instead of throwing.
export function useParentStep(): string | null {
  return useContext(ParentStepContext)
}

interface StepperProviderProps {
  value: string
  onValueChange: (value: string) => void
  onBeforeChange?: (from: string, to: string) => boolean | string
  showConnectors: boolean
  completed: boolean
  collapsibleNestedSteps: boolean
  children: ReactNode
}

export function StepperProvider({
  value,
  onValueChange,
  onBeforeChange,
  showConnectors,
  completed,
  collapsibleNestedSteps,
  children
}: StepperProviderProps) {
  const [orderedSteps, setOrderedSteps] = useState<string[]>([])
  const [nestedSteps, setNestedSteps] = useState<Map<string, string[]>>(new Map())
  const [nestedStepStates, setNestedStepStates] = useState<Map<string, Map<string, StepState>>>(new Map())
  const [stepMeta, setStepMeta] = useState<Map<string, StepMeta>>(new Map())
  const [furthestReached, setFurthestReached] = useState(0)

  // Track active nested step for unmount fallback
  const activeNestedStepRef = useRef<{ parent: string; value: string } | null>(null)

  // Update furthest reached when value changes
  const activeIndex = orderedSteps.indexOf(value)

  // Check if value is a nested step value
  const activeParentFromNestedStep = useMemo(() => {
    for (const [parent, subs] of nestedSteps.entries()) {
      if (subs.includes(value)) {
        return parent
      }
    }
    return null
  }, [nestedSteps, value])

  const effectiveActiveIndex = useMemo(() => {
    if (activeIndex >= 0) return activeIndex
    if (activeParentFromNestedStep) {
      return orderedSteps.indexOf(activeParentFromNestedStep)
    }
    return -1
  }, [activeIndex, activeParentFromNestedStep, orderedSteps])

  useEffect(() => {
    if (effectiveActiveIndex > furthestReached) {
      setFurthestReached(effectiveActiveIndex)
    }
  }, [effectiveActiveIndex, furthestReached])

  // Animation transitioning state
  const [transitioning, setTransitioning] = useState<{ sourceIndex: number; targetIndex: number } | null>(null)
  const isFirstRenderAnim = useRef(true)
  const prevEffectiveIndex = useRef(effectiveActiveIndex)

  useEffect(() => {
    if (isFirstRenderAnim.current) {
      isFirstRenderAnim.current = false
      prevEffectiveIndex.current = effectiveActiveIndex
      return
    }

    const prev = prevEffectiveIndex.current
    prevEffectiveIndex.current = effectiveActiveIndex

    // Only animate forward
    if (effectiveActiveIndex > prev && prev >= 0 && effectiveActiveIndex >= 0) {
      setTransitioning({ sourceIndex: prev, targetIndex: effectiveActiveIndex })
      const timer = setTimeout(() => setTransitioning(null), 600)
      return () => clearTimeout(timer)
    }
  }, [effectiveActiveIndex])

  // Track active nested step for unmount detection
  useEffect(() => {
    if (activeParentFromNestedStep) {
      activeNestedStepRef.current = { parent: activeParentFromNestedStep, value }
    } else {
      activeNestedStepRef.current = null
    }
  }, [activeParentFromNestedStep, value])

  const registerStep = useCallback((stepValue: string) => {
    setOrderedSteps(prev => {
      if (prev.includes(stepValue)) return prev
      return [...prev, stepValue]
    })
    return () => {
      setOrderedSteps(prev => prev.filter(v => v !== stepValue))
      setStepMeta(prev => {
        const next = new Map(prev)
        next.delete(stepValue)
        return next
      })
    }
  }, [])

  const registerNestedStep = useCallback(
    (parentValue: string, nestedStepValue: string) => {
      setNestedSteps(prev => {
        const next = new Map(prev)
        const existing = next.get(parentValue) || []
        if (existing.includes(nestedStepValue)) return prev
        next.set(parentValue, [...existing, nestedStepValue])
        return next
      })
      return () => {
        setNestedSteps(prev => {
          const next = new Map(prev)
          const existing = next.get(parentValue) || []
          next.set(
            parentValue,
            existing.filter(v => v !== nestedStepValue)
          )
          if (next.get(parentValue)?.length === 0) {
            next.delete(parentValue)
          }
          return next
        })

        // If the unmounting nested step was the active one, fall back to parent
        if (
          activeNestedStepRef.current?.value === nestedStepValue &&
          activeNestedStepRef.current?.parent === parentValue
        ) {
          onValueChange(parentValue)
        }
      }
    },
    [onValueChange]
  )

  const registerNestedStepState = useCallback((parentValue: string, nestedStepValue: string, state: StepState) => {
    setNestedStepStates(prev => {
      const next = new Map(prev)
      const parentStates = new Map(next.get(parentValue) ?? [])
      if (parentStates.get(nestedStepValue) === state) return prev
      parentStates.set(nestedStepValue, state)
      next.set(parentValue, parentStates)
      return next
    })
    return () => {
      setNestedStepStates(prev => {
        const next = new Map(prev)
        const parentStates = new Map(next.get(parentValue) ?? [])
        parentStates.delete(nestedStepValue)
        if (parentStates.size === 0) {
          next.delete(parentValue)
        } else {
          next.set(parentValue, parentStates)
        }
        return next
      })
    }
  }, [])

  const registerStepMeta = useCallback((stepValue: string, meta: StepMeta) => {
    setStepMeta(prev => {
      const existing = prev.get(stepValue)
      // Avoid unnecessary re-renders if meta hasn't changed
      if (
        existing &&
        existing.disabled === meta.disabled &&
        existing.blocking === meta.blocking &&
        existing.state === meta.state &&
        existing.loading === meta.loading &&
        existing.totalStepsOverride === meta.totalStepsOverride
      ) {
        return prev
      }
      const next = new Map(prev)
      next.set(stepValue, meta)
      return next
    })
  }, [])

  // Find the first blocking step index
  const firstBlockingIndex = useMemo(() => {
    for (let i = 0; i < orderedSteps.length; i++) {
      const meta = stepMeta.get(orderedSteps[i])
      if (meta?.blocking) {
        return i
      }
    }
    return -1
  }, [orderedSteps, stepMeta])

  const getStepState = useCallback(
    (stepValue: string): StepState => {
      const index = orderedSteps.indexOf(stepValue)
      const meta = stepMeta.get(stepValue)

      // Explicit state override takes precedence
      if (meta?.state) return meta.state

      // Completed prop overrides all remaining states
      if (completed) return 'completed'

      // Active check: direct match or nested step of this step is active
      const isActive = value === stepValue || activeParentFromNestedStep === stepValue

      if (isActive) return 'active'

      // Before active = completed
      if (index < effectiveActiveIndex) return 'completed'

      // Beyond a blocking step = upcoming
      if (firstBlockingIndex >= 0 && index > firstBlockingIndex) return 'upcoming'

      // Up to furthest reached = completed (only if step itself is not blocking or beyond blocking)
      if (index <= furthestReached) return 'completed'

      return 'upcoming'
    },
    [
      orderedSteps,
      stepMeta,
      completed,
      value,
      activeParentFromNestedStep,
      effectiveActiveIndex,
      firstBlockingIndex,
      furthestReached
    ]
  )

  const getNestedStepState = useCallback(
    (parentValue: string, nestedStepValue: string): StepState => {
      const explicitState = nestedStepStates.get(parentValue)?.get(nestedStepValue)
      if (explicitState) return explicitState

      const parentState = getStepState(parentValue)
      if (parentState === 'completed') return 'completed'
      if (parentState !== 'active') return 'upcoming'

      const subs = nestedSteps.get(parentValue) || []
      const subIndex = subs.indexOf(nestedStepValue)

      // If value matches this nested step exactly
      if (value === nestedStepValue) return 'active'

      // If value is a different nested step of same parent, determine relative position
      const activeSubIndex = subs.indexOf(value)
      if (activeSubIndex >= 0 && subIndex < activeSubIndex) return 'completed'

      // If value matches parent directly (no nested step selected) - first nested step active
      if (value === parentValue && subIndex === 0) return 'active'
      if (value === parentValue && subIndex > 0) return 'upcoming'

      return 'upcoming'
    },
    [getStepState, nestedSteps, nestedStepStates, value]
  )

  const isStepDisabled = useCallback(
    (stepValue: string): boolean => {
      const meta = stepMeta.get(stepValue)
      if (meta?.disabled) return true

      const state = getStepState(stepValue)
      if (state === 'upcoming') return true

      // Beyond a blocking step
      const index = orderedSteps.indexOf(stepValue)
      if (firstBlockingIndex >= 0 && index > firstBlockingIndex) return true

      return false
    },
    [stepMeta, getStepState, orderedSteps, firstBlockingIndex]
  )

  // Navigation guard state
  const [pendingNavigation, setPendingNavigation] = useState<{ to: string; message: string } | null>(null)

  const selectStep = useCallback(
    (stepValue: string) => {
      if (isStepDisabled(stepValue)) return

      if (onBeforeChange) {
        const result = onBeforeChange(value, stepValue)
        if (result === false) return
        if (typeof result === 'string') {
          setPendingNavigation({ to: stepValue, message: result })
          return
        }
      }
      onValueChange(stepValue)
    },
    [isStepDisabled, onBeforeChange, value, onValueChange]
  )

  const selectNestedStep = useCallback(
    (nestedStepValue: string) => {
      if (onBeforeChange) {
        const result = onBeforeChange(value, nestedStepValue)
        if (result === false) return
        if (typeof result === 'string') {
          setPendingNavigation({ to: nestedStepValue, message: result })
          return
        }
      }
      onValueChange(nestedStepValue)
    },
    [onBeforeChange, value, onValueChange]
  )

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      onValueChange(pendingNavigation.to)
      setPendingNavigation(null)
    }
  }, [pendingNavigation, onValueChange])

  const cancelNavigation = useCallback(() => {
    setPendingNavigation(null)
  }, [])

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      value,
      onValueChange,
      onBeforeChange,
      showConnectors,
      completed,
      collapsibleNestedSteps,
      orderedSteps,
      nestedSteps,
      stepMeta,
      furthestReached,
      transitioning,
      registerStep,
      registerNestedStep,
      registerNestedStepState,
      registerStepMeta,
      getStepState,
      getNestedStepState,
      isStepDisabled,
      selectStep,
      selectNestedStep,
      pendingNavigation,
      confirmNavigation,
      cancelNavigation
    }),
    [
      value,
      onValueChange,
      onBeforeChange,
      showConnectors,
      completed,
      collapsibleNestedSteps,
      orderedSteps,
      nestedSteps,
      stepMeta,
      furthestReached,
      transitioning,
      registerStep,
      registerNestedStep,
      registerNestedStepState,
      registerStepMeta,
      getStepState,
      getNestedStepState,
      isStepDisabled,
      selectStep,
      selectNestedStep,
      pendingNavigation,
      confirmNavigation,
      cancelNavigation
    ]
  )

  return <StepperContext.Provider value={contextValue}>{children}</StepperContext.Provider>
}
