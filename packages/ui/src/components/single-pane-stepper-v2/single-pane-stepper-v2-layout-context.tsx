import { createContext, ReactNode, useContext, useMemo } from 'react'

interface SinglePaneStepperV2LayoutContextValue {
  showStepBadge: boolean
  totalSteps: number
  showInactiveSteps: boolean
}

const SinglePaneStepperV2LayoutContext = createContext<SinglePaneStepperV2LayoutContextValue>({
  showStepBadge: true,
  totalSteps: 0,
  showInactiveSteps: true
})

export function SinglePaneStepperV2LayoutProvider({
  showStepBadge,
  totalSteps,
  showInactiveSteps,
  children
}: SinglePaneStepperV2LayoutContextValue & { children: ReactNode }) {
  const value = useMemo(
    () => ({ showStepBadge, totalSteps, showInactiveSteps }),
    [showStepBadge, totalSteps, showInactiveSteps]
  )
  return <SinglePaneStepperV2LayoutContext.Provider value={value}>{children}</SinglePaneStepperV2LayoutContext.Provider>
}

export function useSinglePaneStepperV2Layout() {
  return useContext(SinglePaneStepperV2LayoutContext)
}
