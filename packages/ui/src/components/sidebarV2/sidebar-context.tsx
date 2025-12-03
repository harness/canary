import { createContext, forwardRef, useCallback, useContext, useMemo, useState } from 'react'

import { cn } from '@utils/cn'

import { SidebarV2ContextType, SidebarV2ProviderProps, SidebarV2State } from './types'

export type { SidebarV2ContextType, SidebarV2ProviderProps, SidebarV2State } from './types'

/**
 * SidebarV2 Context
 *
 * Manages sidebar state (expanded/collapsed)
 */

const SidebarV2Context = createContext<SidebarV2ContextType | null>(null)

export function useSidebarV2() {
  const context = useContext(SidebarV2Context)
  if (!context) {
    throw new Error('useSidebarV2 must be used within a SidebarV2Provider')
  }
  return context
}

export const SidebarV2Provider = forwardRef<HTMLDivElement, SidebarV2ProviderProps>(
  (
    { defaultCollapsed = false, collapsed: controlledCollapsed, onCollapsedChange, className, children, ...props },
    ref
  ) => {
    const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed)

    const collapsed = controlledCollapsed ?? uncontrolledCollapsed

    const setCollapsed = useCallback(
      (value: boolean) => {
        if (controlledCollapsed === undefined) {
          setUncontrolledCollapsed(value)
        }
        onCollapsedChange?.(value)
      },
      [controlledCollapsed, onCollapsedChange]
    )

    const toggle = useCallback(() => {
      setCollapsed(!collapsed)
    }, [collapsed, setCollapsed])

    const state: SidebarV2State = collapsed ? 'collapsed' : 'expanded'

    const contextValue = useMemo<SidebarV2ContextType>(
      () => ({ state, collapsed, setCollapsed, toggle }),
      [state, collapsed, setCollapsed, toggle]
    )

    return (
      <SidebarV2Context.Provider value={contextValue}>
        <div ref={ref} className={cn('cn-sidebarv2-wrapper', className)} data-state={state} {...props}>
          {children}
        </div>
      </SidebarV2Context.Provider>
    )
  }
)

SidebarV2Provider.displayName = 'SidebarV2Provider'
