import { ComponentProps } from 'react'

export type SidebarV2State = 'expanded' | 'collapsed'

export interface SidebarV2ContextType {
  state: SidebarV2State
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggle: () => void
}

export interface SidebarV2ProviderProps extends ComponentProps<'div'> {
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}
