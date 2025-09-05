import { createContext } from 'react'

export interface RootFormContextProps<T> {
  metadata?: T
}

export const RootFormContext = createContext<RootFormContextProps<unknown>>({})

export interface RootFormProviderProps<T> {
  metadata?: T
}

export function RootFormProvider<T>({ children, metadata }: React.PropsWithChildren<RootFormProviderProps<T>>) {
  return (
    <RootFormContext.Provider
      value={{
        metadata
      }}
    >
      {children}
    </RootFormContext.Provider>
  )
}
