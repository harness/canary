import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { cloneDeep, isEqual } from 'lodash-es'

import { IInputDefinition, useFormContext } from '@harnessio/forms'

import { CommonFormInputConfig } from '../../types/types'
import { autoUpdateAccordionState, convertAccordionStateMap2AccordionValue } from '../common/utils/form-utils'

interface AccordionFormInputContextProps {
  optionalVisibilityState: Map<string, boolean>
  setAccordionValue: (paths: string[]) => void
  accordionValue: string[]
}

const AccordionFormInputContext = createContext<AccordionFormInputContextProps>({
  optionalVisibilityState: new Map(),
  setAccordionValue: (_paths: string[]) => undefined,
  accordionValue: []
})

export interface AccordionFormInputProviderProps {
  inputs: IInputDefinition<unknown>[]
}

export function AccordionFormInputProvider({
  inputs: groups,
  children
}: React.PropsWithChildren<AccordionFormInputProviderProps>) {
  const [optionalVisibilityState, setOptionalVisibilityState] = useState(new Map())
  const [explicitExpandedState, setExplicitExpandedState] = useState(new Map<string, boolean>())
  const [autoExpandedState, setAutoExpandedState] = useState(new Map<string, boolean>())
  const [manuallyExpanded, setManuallyExpanded] = useState(false)

  const { getValues } = useFormContext()
  const values = getValues()

  const latestValuesRef = useRef({})

  useEffect(() => {
    const newValues = cloneDeep(values)

    if (isEqual(latestValuesRef.current, newValues)) {
      return
    }

    latestValuesRef.current = newValues

    const newOptionalVisibilityState = new Map()
    const newAutoExpandState = new Map()

    groups.forEach(groupInput => {
      autoUpdateAccordionState(
        groupInput as IInputDefinition<CommonFormInputConfig>,
        values,
        newOptionalVisibilityState,
        newAutoExpandState
      )
    })

    setOptionalVisibilityState(newOptionalVisibilityState)
    setAutoExpandedState(newAutoExpandState)
  }, [groups, values, latestValuesRef])

  const setAccordionValue = useCallback(
    (paths: string[]) => {
      const newExpandState = new Map(explicitExpandedState)

      for (const key of newExpandState.keys()) {
        newExpandState.set(key, false)
      }

      paths.forEach(path => {
        newExpandState.set(path, true)
      })

      setExplicitExpandedState(newExpandState)
      setManuallyExpanded(true)
    },
    [explicitExpandedState]
  )

  const accordionValue = useMemo(() => {
    if (manuallyExpanded) {
      return convertAccordionStateMap2AccordionValue(explicitExpandedState)
    }

    const merged = mergeExpandState(explicitExpandedState, autoExpandedState)
    return convertAccordionStateMap2AccordionValue(merged)
  }, [manuallyExpanded, explicitExpandedState, autoExpandedState])

  return (
    <AccordionFormInputContext.Provider
      value={{
        optionalVisibilityState,
        setAccordionValue,
        accordionValue
      }}
    >
      {children}
    </AccordionFormInputContext.Provider>
  )
}

export const useAccordionFormInputContext = () => {
  return useContext(AccordionFormInputContext)
}

function mergeExpandState(
  explicitExpandedState: Map<string, boolean>,
  autoExpandedState: Map<string, boolean>
): Map<string, boolean> {
  const merged = new Map(autoExpandedState)

  explicitExpandedState.forEach((value, key) => {
    merged.set(key, value)
  })

  return merged
}
