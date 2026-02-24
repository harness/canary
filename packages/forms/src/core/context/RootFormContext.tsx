import { createContext } from 'react'

export interface RootFormContextProps<T> {
  metadata?: T
  readonly?: boolean
  inputErrorHandler?: (error: Error) => void
}

export const RootFormContext = createContext<RootFormContextProps<unknown>>({})

export interface RootFormProviderProps<T> {
  metadata?: T
  readonly?: boolean
  inputErrorHandler?: (error: Error) => void
}

export function RootFormProvider<T>({
  children,
  metadata,
  inputErrorHandler,
  readonly
}: React.PropsWithChildren<RootFormProviderProps<T>>) {
  return (
    <RootFormContext.Provider
      value={{
        metadata,
        readonly,
        inputErrorHandler
      }}
    >
      {children}
    </RootFormContext.Provider>
  )
}
