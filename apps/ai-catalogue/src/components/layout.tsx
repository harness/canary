import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/catalogue', label: 'Component Catalogue' },
  { path: '/composer', label: 'Message Composer' },
  { path: '/playground', label: 'Chat Playground' }
]

export function Layout() {
  return (
    <div className="flex h-screen bg-cn-1">
      {/* Sidebar */}
      <aside className="w-56 border-r border-cn-3 flex flex-col bg-cn-2 shrink-0">
        <div className="px-cn-md py-cn-md border-b border-cn-3">
          <h1 className="text-cn-size-2 font-bold text-cn-1 tracking-tight">AI Chat Catalogue</h1>
          <p className="text-cn-size-0 text-cn-3 mt-cn-4xs">Component Explorer</p>
        </div>
        <nav className="flex-1 py-cn-xs">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-cn-md py-cn-xs text-cn-size-2 transition-colors ${
                  isActive
                    ? 'bg-cn-3 text-cn-1 font-medium'
                    : 'text-cn-3 hover:text-cn-1 hover:bg-cn-hover'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-cn-md py-cn-sm border-t border-cn-3">
          <p className="text-cn-size-0 text-cn-4">
            Powered by @harnessio/ai-chat-core
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
