import { createContext } from 'react'

import { StateContextType, StateProviderProps } from '@/views/user-management/providers/state-provider'

export const StateContext = createContext<StateContextType | undefined>(undefined)

export const StateProvider = ({ children, loadingStates, errorStates }: StateProviderProps) => {
  return (
    <StateContext.Provider
      value={{
        loadingStates,
        errorStates
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
