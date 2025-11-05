import { MouseEvent, useCallback } from 'react'

import { useTranslation } from '@/context'

import { useSidebar } from './sidebar-context'
import { SidebarItem } from './sidebar-item'

export interface SidebarToggleMenuButtonProps {
  title?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const SidebarToggleMenuButton = ({ onClick }: SidebarToggleMenuButtonProps) => {
  const { toggleSidebar, state } = useSidebar()
  const { t } = useTranslation()

  const collapsed = state === 'collapsed'

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      toggleSidebar()
      event.stopPropagation()
    },
    [onClick, toggleSidebar]
  )

  return (
    <SidebarItem
      onClick={handleClick}
      title={''}
      icon="sidebar"
      aria-label={
        collapsed
          ? t('component:sidebar.sidebarToggle.expand', 'Expand')
          : t('component:sidebar.sidebarToggle.collapse', 'Collapse')
      }
    />
  )
}
