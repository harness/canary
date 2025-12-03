import { ReactNode } from 'react'

import { IconV2NamesType } from '@components/icon-v2'

export type SidebarItemV2Variant = 'default' | 'drawer' | 'collapsed'

export interface SidebarItemV2RootProps {
  /**
   * Icon name to render as the leading element
   */
  iconName?: IconV2NamesType
  /**
   * Content to display (typically text label)
   */
  content?: ReactNode
  /**
   * ReactNode for trailing elements (actions, badges, etc.)
   */
  suffix?: ReactNode
  /**
   * Tooltip content shown on hover (always shown when collapsed)
   */
  tooltip?: ReactNode
  /**
   * Whether the item is currently selected/active
   */
  selected?: boolean
  /**
   * Whether the item is disabled
   */
  disabled?: boolean
  /**
   * Additional class name
   */
  className?: string
  /**
   * Children to render
   */
  children?: ReactNode
  /**
   * Whether the item should expand by default
   */
  defaultExpand?: boolean
  /**
   * ReactNode for trailing item actions
   */
  itemAction?: ReactNode | ((props: { hovering: boolean }) => ReactNode)
}

export interface SidebarItemV2ButtonProps extends SidebarItemV2RootProps {
  to?: never
  onClick?: () => void
}

export interface SidebarItemV2LinkProps extends SidebarItemV2RootProps {
  to: string
  onClick?: never
}

export type SidebarItemV2Props = SidebarItemV2ButtonProps | SidebarItemV2LinkProps
