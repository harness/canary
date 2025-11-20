import { useState } from 'react'

import { motion } from 'framer-motion'

import { Button } from './button'
import { IconV2 } from './icon-v2'
import { Text } from './text'

interface SidebarRail2Props {
  left: React.ReactElement
  right: React.ReactElement
}

const SidebarRail2: React.FC<SidebarRail2Props> = ({ left, right }) => {
  const [open, setOpen] = useState(true)
  const [hover, setHover] = useState(false)

  const baseWidth = open ? 240 : 72
  const bump = hover ? (open ? -5 : 5) : 0 // Flip bump direction
  const sidebarWidth = baseWidth + bump

  return (
    <div className="flex h-screen relative">
      {/* left */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ type: 'tween', duration: 0.2 }}
        className="flex flex-col bg-white border-r shadow-sm overflow-hidden"
      >
        {left}
      </motion.aside>

      {/* Separator */}
      <motion.div
        className="absolute top-0 bottom-0 z-10 flex items-center cursor-pointer select-none"
        style={{ left: baseWidth - 2, width: 24 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(prev => !prev)}
        animate={{ x: bump }} // bump the whole container
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Vertical line */}
        <motion.div
          className="w-1 h-full bg-gray-300 rounded"
          animate={{}} // optional: can animate line independently if needed
        />

        {/* Icon moves along with container bump */}
        <motion.div
          className="absolute flex items-center justify-center text-gray-600 font-bold select-none pointer-events-none"
          style={hover ? { left: -6 } : { left: 4 }} // 4px to the right of the line when not hovering
          animate={{ x: 0 }} // now moves with parent container
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {hover ? (
            open ? (
              <Button variant="transparent" iconOnly tooltipProps={{ content: 'Collapse' }}>
                <IconV2 name="nav-arrow-left" size="lg" />
              </Button>
            ) : (
              <Button variant="transparent" iconOnly tooltipProps={{ content: 'Expand' }}>
                <IconV2 name="nav-arrow-right" size="lg" />
              </Button>
            )
          ) : (
            <Text>|</Text>
          )}
        </motion.div>
      </motion.div>

      {/* Right content */}
      {right}
    </div>
  )
}

export { SidebarRail2 }
