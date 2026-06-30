import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { StepState } from './stepper-types'

interface StepMeta {
  disabled?: boolean
  blocking?: boolean
  state?: StepState
  loading?: boolean
}

interface StepperContextValue {
  value: string
  onValueChange: (value: string) => void
  onBeforeChange?: (from: string, to: string) => boolean | string
  showConnectors: boolean
  completed: boolean
  orderedSteps: string[]
  subSteps: Map<string, string[]>
  stepMeta: Map<string, StepMeta>
  furthestReached: number
  transitioning: { sourceIndex: number; targetIndex: number } | null
  registerStep: (value: string) => () => void
  registerSubStep: (parentValue: string, subStepValue: string) => () => void
  registerSubStepState: (parentValue: string, subStepValue: string, state: StepState) => () => void
  registerStepMeta: (value: string, meta: StepMeta) => void
  getStepState: (value: string) => StepState
  getSubStepState: (parentValue: string, subStepValue: string) => StepState
  isStepDisabled: (value: string) => boolean
  selectStep: (stepValue: string) => void
  selectSubStep: (subStepValue: string) => void
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

// Parent step context for substeps
const ParentStepContext = createContext<string | null>(null)

export function ParentStepProvider({ value, children }: { value: string; children: ReactNode }) {
  return <ParentStepContext.Provider value={value}>{children}</ParentStepContext.Provider>
}

export function useParentStep(): string {
  const parentValue = useContext(ParentStepContext)
  if (!parentValue) {
    throw new Error('useParentStep must be used within a ParentStepProvider')
  }
  return parentValue
}

interface StepperProviderProps {
  value: string
  onValueChange: (value: string) => void
  onBeforeChange?: (from: string, to: string) => boolean | string
  showConnectors: boolean
  completed: boolean
  children: ReactNode
}

export function StepperProvider({
  value,
  onValueChange,
  onBeforeChange,
  showConnectors,
  completed,
  children
}: StepperProviderProps) {
  const [orderedSteps, setOrderedSteps] = useState<string[]>([])
  const [subSteps, setSubSteps] = useState<Map<string, string[]>>(new Map())
  const [subStepStates, setSubStepStates] = useState<Map<string, Map<string, StepState>>>(new Map())
  const [stepMeta, setStepMeta] = useState<Map<string, StepMeta>>(new Map())
  const [furthestReached, setFurthestReached] = useState(0)

  // Track active substep for unmount fallback
  const activeSubStepRef = useRef<{ parent: string; value: string } | null>(null)

  // Update furthest reached when value changes
  const activeIndex = orderedSteps.indexOf(value)

  // Check if value is a substep value
  const activeParentFromSubStep = useMemo(() => {
    for (const [parent, subs] of subSteps.entries()) {
      if (subs.includes(value)) {
        return parent
      }
    }
    return null
  }, [subSteps, value])

  const effectiveActiveIndex = useMemo(() => {
    if (activeIndex >= 0) return activeIndex
    if (activeParentFromSubStep) {
      return orderedSteps.indexOf(activeParentFromSubStep)
    }
    return -1
  }, [activeIndex, activeParentFromSubStep, orderedSteps])

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

  // Track active substep for unmount detection
  useEffect(() => {
    if (activeParentFromSubStep) {
      activeSubStepRef.current = { parent: activeParentFromSubStep, value }
    } else {
      activeSubStepRef.current = null
    }
  }, [activeParentFromSubStep, value])

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

  const registerSubStep = useCallback(
    (parentValue: string, subStepValue: string) => {
      setSubSteps(prev => {
        const next = new Map(prev)
        const existing = next.get(parentValue) || []
        if (existing.includes(subStepValue)) return prev
        next.set(parentValue, [...existing, subStepValue])
        return next
      })
      return () => {
        setSubSteps(prev => {
          const next = new Map(prev)
          const existing = next.get(parentValue) || []
          next.set(
            parentValue,
            existing.filter(v => v !== subStepValue)
          )
          if (next.get(parentValue)?.length === 0) {
            next.delete(parentValue)
          }
          return next
        })

        // If the unmounting substep was the active one, fall back to parent
        if (activeSubStepRef.current?.value === subStepValue && activeSubStepRef.current?.parent === parentValue) {
          onValueChange(parentValue)
        }
      }
    },
    [onValueChange]
  )

  const registerSubStepState = useCallback((parentValue: string, subStepValue: string, state: StepState) => {
    setSubStepStates(prev => {
      const next = new Map(prev)
      const parentStates = new Map(next.get(parentValue) ?? [])
      if (parentStates.get(subStepValue) === state) return prev
      parentStates.set(subStepValue, state)
      next.set(parentValue, parentStates)
      return next
    })
    return () => {
      setSubStepStates(prev => {
        const next = new Map(prev)
        const parentStates = new Map(next.get(parentValue) ?? [])
        parentStates.delete(subStepValue)
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
        existing.loading === meta.loading
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

      // Active check: direct match or substep of this step is active
      const isActive = value === stepValue || activeParentFromSubStep === stepValue

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
      activeParentFromSubStep,
      effectiveActiveIndex,
      firstBlockingIndex,
      furthestReached
    ]
  )

  const getSubStepState = useCallback(
    (parentValue: string, subStepValue: string): StepState => {
      const explicitState = subStepStates.get(parentValue)?.get(subStepValue)
      if (explicitState) return explicitState

      const parentState = getStepState(parentValue)
      if (parentState === 'completed') return 'completed'
      if (parentState !== 'active') return 'upcoming'

      const subs = subSteps.get(parentValue) || []
      const subIndex = subs.indexOf(subStepValue)

      // If value matches this substep exactly
      if (value === subStepValue) return 'active'

      // If value is a different substep of same parent, determine relative position
      const activeSubIndex = subs.indexOf(value)
      if (activeSubIndex >= 0 && subIndex < activeSubIndex) return 'completed'

      // If value matches parent directly (no substep selected) - first substep active
      if (value === parentValue && subIndex === 0) return 'active'
      if (value === parentValue && subIndex > 0) return 'upcoming'

      return 'upcoming'
    },
    [getStepState, subSteps, subStepStates, value]
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

  const selectSubStep = useCallback(
    (subStepValue: string) => {
      if (onBeforeChange) {
        const result = onBeforeChange(value, subStepValue)
        if (result === false) return
        if (typeof result === 'string') {
          setPendingNavigation({ to: subStepValue, message: result })
          return
        }
      }
      onValueChange(subStepValue)
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
      orderedSteps,
      subSteps,
      stepMeta,
      furthestReached,
      transitioning,
      registerStep,
      registerSubStep,
      registerSubStepState,
      registerStepMeta,
      getStepState,
      getSubStepState,
      isStepDisabled,
      selectStep,
      selectSubStep,
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
      orderedSteps,
      subSteps,
      stepMeta,
      furthestReached,
      transitioning,
      registerStep,
      registerSubStep,
      registerSubStepState,
      registerStepMeta,
      getStepState,
      getSubStepState,
      isStepDisabled,
      selectStep,
      selectSubStep,
      pendingNavigation,
      confirmNavigation,
      cancelNavigation
    ]
  )

  return <StepperContext.Provider value={contextValue}>{children}</StepperContext.Provider>
}
