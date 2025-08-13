// ComponentContext.tsx

import React, { createContext, ReactNode, useContext } from 'react'

import { RbacButtonProps, RbacSplitButtonProps } from '@components/rbac'

interface ComponentContextValue {
  RbacButton: React.ComponentType<RbacButtonProps>
  RbacSplitButton: <T extends string>(props: RbacSplitButtonProps<T>) => JSX.Element
}

const ComponentContext = createContext<ComponentContextValue | undefined>(undefined)

export const ComponentProvider = ({
  components,
  children
}: {
  components: ComponentContextValue
  children: ReactNode
}) => {
  return <ComponentContext.Provider value={components}>{children}</ComponentContext.Provider>
}

export const useComponents = () => {
  const ctx = useContext(ComponentContext)
  if (!ctx) throw new Error('useComponents must be used within ComponentProvider')
  return ctx
}
