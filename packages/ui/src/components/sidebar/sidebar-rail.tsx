import { ComponentProps, forwardRef, MouseEvent, useCallback, useState } from 'react'

import { IconV2, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'
import { motion } from 'framer-motion'

import { useSidebar } from './sidebar-context'

export const SidebarRail = forwardRef<HTMLButtonElement, ComponentProps<'button'> & { open?: boolean }>(
  ({ className, onClick, open, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()
    const { t } = useTranslation()
    const [hovered, setHovered] = useState(false)

    const onClickHandler = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        toggleSidebar()
      },
      [toggleSidebar, onClick]
    )

    const label = open ? t('component:sidebar.collapse', 'Collapse') : t('component:sidebar.expand', 'Expand')

    const bump = hovered ? (open ? -5 : 5) : 0 // Flip bump direction

    return (
      <motion.div
        className={cn(
          'cn-sidebar-rail',
          'absolute top-0 bottom-0 z-10 flex items-center cursor-pointer select-none w-8 border-r border-cn-3',
          open ? 'left-[var(--cn-sidebar-container-full-width)]' : 'left-[var(--cn-size-16)]',
          'cn-sidebar-rail',
          className
        )}
        onClick={() => onClickHandler}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ x: bump }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <button ref={ref} aria-label={label} title={label} tabIndex={-1} {...props}>
          <div
            className={cn(
              'absolute top-[calc(50%-var(--cn-header-height))]',
              { 'translate-x-1/2': hovered },
              className
            )}
          >
            {hovered ? (
              <IconV2 name={open ? 'nav-arrow-left' : 'nav-arrow-right'} size="lg" />
            ) : (
              <Text className="cn-pl-1">|</Text>
            )}
          </div>
        </button>
      </motion.div>
    )
  }
)
SidebarRail.displayName = 'SidebarRail'
