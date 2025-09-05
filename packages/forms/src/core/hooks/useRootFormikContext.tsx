import { useContext } from 'react'

import { RootFormContext, RootFormContextProps } from '../context/RootFormContext'

export function useRootFormContext<T>() {
  const ctx = useContext(RootFormContext)

  if (!ctx) {
    console.warn('useRootFormContext must be used within RootFormProvider')
  }

  return ctx as RootFormContextProps<T>
}
