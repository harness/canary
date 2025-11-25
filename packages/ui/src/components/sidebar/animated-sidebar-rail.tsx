import { useCallback, useState } from 'react'

import { useTranslation } from '@/context'
import { motion } from 'framer-motion'

import { useSidebar } from '.'
import { IconV2 } from '../icon-v2'
import { Text } from '../text'
import { Tooltip } from '../tooltip'

// Constants for sidebar positioning
const BUMP_PX = 3 // Pixels to bump the sidebar on hover
const EXPANDED_LEFT = 230 // Left position when sidebar is expanded
const COLLAPSED_LEFT = 64 // Left position when sidebar is collapsed

const AnimatedSideBarRail: React.FC = () => {
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
      className="absolute w-6 top-[var(--cn-header-height)] bottom-0 z-20 flex items-center border-l border-t bg-cn-2 rounded-tl-cn-3"
      animate={{
        x: shiftWithBump,
        transition: { type: 'tween', ease: 'easeOut' } // Smooth tween animation
      }}
    >
      <Tooltip content={label} side="right" delay={0}>
        <div
          className="flex items-center justify-center w-full h-6 relative text-gray-600 cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label={label}
        >
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
      </Tooltip>
    </motion.div>
  )
}

export { AnimatedSideBarRail }
