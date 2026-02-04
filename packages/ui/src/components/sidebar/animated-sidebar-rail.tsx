import { HTMLAttributes, useCallback, useState } from 'react'

import { useTranslation } from '@/context'
import { cn } from '@utils/cn'
import { motion } from 'framer-motion'

import { useSidebar } from '.'
import { IconV2 } from '../icon-v2'
import { Text } from '../text'
import { Tooltip } from '../tooltip'

// Constants for sidebar positioning
const BUMP_PX = 3 // Pixels to bump the sidebar on hover
const EXPANDED_LEFT = 230 // Left position when sidebar is expanded
const COLLAPSED_LEFT = 61 // Left position when sidebar is collapsed

interface AnimatedSideBarRailProps extends Pick<HTMLAttributes<HTMLElement>, 'className'> {}

const AnimatedSideBarRail: React.FC<AnimatedSideBarRailProps> = ({ className }) => {
  const { t } = useTranslation()
  const { state, toggleSidebar } = useSidebar()

  const open = state === 'expanded'
  const [hover, setHover] = useState(false)

  const onClickHandler = useCallback(() => {
    toggleSidebar()
  }, [toggleSidebar])

  // Label for tooltip and aria-label depending on sidebar state
  const label = open ? t('component:sidebar.collapse', 'Collapse') : t('component:sidebar.expand', 'Expand')

  /**
   * Calculate the sidebar position with bump effect on hover.
   * When collapsed, the absolute rail needs to be slightly outside the left edge by BUMP_PX.
   */
  const sidebarShift = open ? EXPANDED_LEFT : COLLAPSED_LEFT - BUMP_PX
  const bump = hover ? (open ? -1 * BUMP_PX : BUMP_PX) : 0
  const shiftWithBump = sidebarShift + bump

  return (
    <motion.div
      data-id="sidebar-rail"
      className={cn('absolute w-3 bottom-0 z-20 flex items-center border-l border-t rounded-tl-cn-3', className)}
      initial={false}
      animate={{
        x: shiftWithBump,
        transition: { type: 'tween', ease: 'easeOut' } // Smooth tween animation
      }}
    >
      <Tooltip content={label} side="right" delay={0}>
        <div
          className="text-gray-600 absolute flex size-10 -translate-x-1/2 cursor-pointer items-center justify-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label={label}
        >
          <div className="relative left-cn-2xs">
            {hover ? (
              <IconV2
                name={open ? 'nav-arrow-left' : 'nav-arrow-right'}
                size="lg"
                className="text-cn-sidebar-toggle"
                onClick={onClickHandler} // Toggle sidebar on icon click
              />
            ) : (
              <Text className="text-cn-sidebar-toggle">|</Text> // Placeholder when not hovered
            )}
          </div>
        </div>
      </Tooltip>
    </motion.div>
  )
}

export { AnimatedSideBarRail }
