import { createContext } from 'react'

export interface RootFormContextProps<T> {
  metadata?: T
  readonly?: boolean
}

export const RootFormContext = createContext<RootFormContextProps<unknown>>({})

export interface RootFormProviderProps<T> {
  metadata?: T
  readonly?: boolean
}

export function RootFormProvider<T>({
  children,
  metadata,
  readonly
}: React.PropsWithChildren<RootFormProviderProps<T>>) {
  return (
    <RootFormContext.Provider
      value={{
        metadata,
        readonly
      }}
    >
      {children}
    </RootFormContext.Provider>
  )
}
