import { useState } from 'react'

import { motion } from 'framer-motion' // v6 compatible

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'payments', label: 'Payments', icon: '💰', badge: 3 },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

const SidebarCollapse = () => {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState('dashboard')
  const [hover, setHover] = useState(false)

  const baseWidth = open ? 240 : 72
  const bump = hover ? (open ? -5 : 5) : 0 // Flip bump direction
  const sidebarWidth = baseWidth + bump
  const rightMargin = baseWidth + bump

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ type: 'tween', duration: 0.2 }}
        className="flex flex-col bg-white border-r shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-3 px-3 py-3 border-b">
          <div className="flex items-center justify-center rounded-md bg-indigo-600 text-white w-10 h-10">S</div>
          {open && <span className="text-sm font-semibold">Stripe UI</span>}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-1">
            {ITEMS.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActive(item.id)}
                  className={`flex items-center gap-3 rounded-md px-2 py-2 w-full hover:bg-gray-50 focus:outline-none ${
                    active === item.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10">{item.icon}</div>
                  {open && <span className="flex-1 text-left text-sm">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
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
          style={{ left: 6 }} // 5px to the right of the line
          animate={{ x: 0 }} // now moves with parent container
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {hover ? (open ? '<' : '>') : '|'}
        </motion.div>
      </motion.div>

      {/* Right content */}
      <motion.main
        className="flex-1 p-6 bg-gray-50"
        animate={{ marginLeft: rightMargin }}
        transition={{ type: 'tween', duration: 0.2 }}
      >
        <h1 className="text-2xl font-semibold">Main content</h1>
        <p className="mt-4 text-sm text-gray-600">
          Hover over the separator to bump the line. Icons always stay 5px to the right of it. Click to toggle sidebar.
        </p>
      </motion.main>
    </div>
  )
}

export { SidebarCollapse }
