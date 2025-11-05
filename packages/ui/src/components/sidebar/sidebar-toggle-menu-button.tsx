import { MouseEvent, useCallback } from 'react'

import { useTranslation } from '@/context'
import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'

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
    <Button
      variant="transparent"
      size="sm"
      iconOnly
      tooltipProps={{
        content: collapsed
          ? t('component:sidebar.sidebarToggle.expand', 'Expand')
          : t('component:sidebar.sidebarToggle.collapse', 'Collapse')
      }}
      onClick={handleClick}
    >
      <IconV2 name="sidebar" size="md" />
    </Button>
  )
}
