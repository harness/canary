import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/catalogue', label: 'Component Catalogue', icon: '◻' },
  { path: '/composer', label: 'Message Composer', icon: '⚡' },
  { path: '/playground', label: 'Chat Playground', icon: '▶' }
]

export function Layout() {
  return (
    <div className="flex h-screen bg-cn-background-1">
      {/* Sidebar */}
      <aside className="w-56 border-r border-cn-borders-3 flex flex-col bg-cn-background-2">
        <div className="px-4 py-4 border-b border-cn-borders-3">
          <h1 className="text-sm font-bold text-cn-foreground-1 tracking-tight">AI Chat Catalogue</h1>
          <p className="text-xs text-cn-foreground-3 mt-0.5">Component Explorer</p>
        </div>
        <nav className="flex-1 py-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-cn-background-3 text-cn-foreground-1 font-medium'
                    : 'text-cn-foreground-3 hover:text-cn-foreground-1 hover:bg-cn-background-3/50'
                }`
              }
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-cn-borders-3">
          <p className="text-[10px] text-cn-foreground-4">
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
