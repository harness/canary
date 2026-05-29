import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type DrawerDualPaneStepState = 'active' | 'completed' | 'upcoming'

type DrawerDualPaneContextType = {
  value: string
  onValueChange?: (value: string) => void
  registerStep: (value: string) => () => void
  registerSubStep: (parentValue: string, subStepValue: string) => () => void
  orderedSteps: string[]
  getStepState: (stepValue: string) => DrawerDualPaneStepState
  getSubStepState: (parentValue: string, subStepValue: string) => DrawerDualPaneStepState
  getStepIndex: (stepValue: string) => number
  getSubStepIndex: (parentValue: string, subStepValue: string) => number
  totalSteps: number
  isStepNavigable: (stepValue: string) => boolean
  isSubStepNavigable: (parentValue: string, subStepValue: string) => boolean
  selectStep: (stepValue: string) => void
  selectSubStep: (subStepValue: string) => void
}

const DrawerDualPaneContext = createContext<DrawerDualPaneContextType | null>(null)

export const useDrawerDualPaneContext = () => {
  const context = useContext(DrawerDualPaneContext)

  if (!context) {
    throw new Error('Drawer dual pane components must be used within Drawer.Steps')
  }

  return context
}

export const useOptionalDrawerDualPaneContext = () => {
  return useContext(DrawerDualPaneContext)
}

const ParentStepContext = createContext<string | null>(null)

export const useParentStepValue = () => useContext(ParentStepContext)

export const ParentStepProvider = ({ value, children }: { value: string; children: ReactNode }) => (
  <ParentStepContext.Provider value={value}>{children}</ParentStepContext.Provider>
)

type DrawerDualPaneProviderProps = {
  value: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

export const DrawerDualPaneProvider = ({ value, onValueChange, children }: DrawerDualPaneProviderProps) => {
  const [orderedSteps, setOrderedSteps] = useState<string[]>([])
  const [substepsByParent, setSubstepsByParent] = useState<Record<string, string[]>>({})
  // Track the highest top-level step index ever reached (directly or via one of its substeps)
  // and the highest substep index ever reached per parent. Combined with the index-based linear
  // progression assumption, this lets a user freely navigate backwards or forwards to any step
  // they've already visited.
  const [furthestStepIndex, setFurthestStepIndex] = useState(-1)
  const [furthestSubStepIndexByParent, setFurthestSubStepIndexByParent] = useState<Record<string, number>>({})

  const registerStep = useCallback((stepValue: string) => {
    setOrderedSteps(previousSteps => {
      if (previousSteps.includes(stepValue)) {
        return previousSteps
      }

      return [...previousSteps, stepValue]
    })

    return () => {
      setOrderedSteps(previousSteps => previousSteps.filter(step => step !== stepValue))
    }
  }, [])

  const registerSubStep = useCallback((parentValue: string, subStepValue: string) => {
    setSubstepsByParent(previous => {
      const list = previous[parentValue] ?? []

      if (list.includes(subStepValue)) {
        return previous
      }

      return { ...previous, [parentValue]: [...list, subStepValue] }
    })

    return () => {
      setSubstepsByParent(previous => {
        const list = previous[parentValue] ?? []
        const next = list.filter(step => step !== subStepValue)

        if (next.length === 0) {
          const { [parentValue]: _omitted, ...rest } = previous
          return rest
        }

        return { ...previous, [parentValue]: next }
      })
    }
  }, [])

  // Normalize the active value to a top-level step value: if it's a substep, return its parent.
  const effectiveActiveStepValue = useMemo<string | null>(() => {
    if (orderedSteps.includes(value)) {
      return value
    }

    for (const [parentValue, subs] of Object.entries(substepsByParent)) {
      if (subs.includes(value)) {
        return parentValue
      }
    }

    return null
  }, [value, orderedSteps, substepsByParent])

  // Bump furthest-reached step index whenever the effective active step advances past it.
  useEffect(() => {
    if (effectiveActiveStepValue === null) {
      return
    }

    const index = orderedSteps.indexOf(effectiveActiveStepValue)

    if (index > -1) {
      setFurthestStepIndex(previous => (index > previous ? index : previous))
    }
  }, [effectiveActiveStepValue, orderedSteps])

  // Bump furthest-reached substep index for the active substep's parent.
  useEffect(() => {
    for (const [parentValue, subs] of Object.entries(substepsByParent)) {
      const index = subs.indexOf(value)

      if (index > -1) {
        setFurthestSubStepIndexByParent(previous => {
          const current = previous[parentValue] ?? -1
          return index > current ? { ...previous, [parentValue]: index } : previous
        })
        return
      }
    }
  }, [value, substepsByParent])

  const getStepState = useCallback(
    (stepValue: string): DrawerDualPaneStepState => {
      const activeIndex = effectiveActiveStepValue !== null ? orderedSteps.indexOf(effectiveActiveStepValue) : -1
      const stepIndex = orderedSteps.indexOf(stepValue)

      if (stepIndex === -1) {
        return 'upcoming'
      }

      if (stepIndex === activeIndex) {
        return 'active'
      }

      // Linear-progression assumption: any step before the active step has been completed.
      if (activeIndex !== -1 && stepIndex < activeIndex) {
        return 'completed'
      }

      // Furthest-reached: any step the user has previously visited stays navigable as 'completed',
      // even if they've since navigated backwards past it.
      if (stepIndex <= furthestStepIndex) {
        return 'completed'
      }

      return 'upcoming'
    },
    [orderedSteps, effectiveActiveStepValue, furthestStepIndex]
  )

  const getSubStepState = useCallback(
    (parentValue: string, subStepValue: string): DrawerDualPaneStepState => {
      // Substeps only have meaningful state when their parent step is active.
      if (effectiveActiveStepValue !== parentValue) {
        return 'upcoming'
      }

      const subs = substepsByParent[parentValue] ?? []
      const subIndex = subs.indexOf(subStepValue)

      if (subIndex === -1) {
        return 'upcoming'
      }

      if (value === subStepValue) {
        return 'active'
      }

      // Linear-progression assumption within the substep flow: substeps before the active substep
      // are completed.
      if (value !== parentValue) {
        const activeSubIndex = subs.indexOf(value)
        if (activeSubIndex !== -1 && subIndex < activeSubIndex) {
          return 'completed'
        }
      }

      // Furthest-reached: any substep the user has previously visited stays navigable as 'completed'.
      const furthestSubIndex = furthestSubStepIndexByParent[parentValue] ?? -1
      if (subIndex <= furthestSubIndex) {
        return 'completed'
      }

      return 'upcoming'
    },
    [value, substepsByParent, effectiveActiveStepValue, furthestSubStepIndexByParent]
  )

  const getStepIndex = useCallback((stepValue: string) => orderedSteps.indexOf(stepValue), [orderedSteps])

  const getSubStepIndex = useCallback(
    (parentValue: string, subStepValue: string) => (substepsByParent[parentValue] ?? []).indexOf(subStepValue),
    [substepsByParent]
  )

  const isStepNavigable = useCallback(
    (stepValue: string) => {
      const state = getStepState(stepValue)

      return state === 'completed' || state === 'active'
    },
    [getStepState]
  )

  const isSubStepNavigable = useCallback(
    (parentValue: string, subStepValue: string) => {
      const state = getSubStepState(parentValue, subStepValue)

      return state === 'completed' || state === 'active'
    },
    [getSubStepState]
  )

  const selectStep = useCallback(
    (stepValue: string) => {
      if (!isStepNavigable(stepValue) || stepValue === value) {
        return
      }

      onValueChange?.(stepValue)
    },
    [isStepNavigable, onValueChange, value]
  )

  const selectSubStep = useCallback(
    (subStepValue: string) => {
      if (subStepValue === value) {
        return
      }

      let parentValue: string | null = null
      for (const [parent, subs] of Object.entries(substepsByParent)) {
        if (subs.includes(subStepValue)) {
          parentValue = parent
          break
        }
      }

      if (parentValue === null || !isSubStepNavigable(parentValue, subStepValue)) {
        return
      }

      onValueChange?.(subStepValue)
    },
    [substepsByParent, isSubStepNavigable, onValueChange, value]
  )

  const contextValue = useMemo(
    () => ({
      value,
      onValueChange,
      registerStep,
      registerSubStep,
      orderedSteps,
      getStepState,
      getSubStepState,
      getStepIndex,
      getSubStepIndex,
      totalSteps: orderedSteps.length,
      isStepNavigable,
      isSubStepNavigable,
      selectStep,
      selectSubStep
    }),
    [
      value,
      onValueChange,
      registerStep,
      registerSubStep,
      orderedSteps,
      getStepState,
      getSubStepState,
      getStepIndex,
      getSubStepIndex,
      isStepNavigable,
      isSubStepNavigable,
      selectStep,
      selectSubStep
    ]
  )

  return <DrawerDualPaneContext.Provider value={contextValue}>{children}</DrawerDualPaneContext.Provider>
}
