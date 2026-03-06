import { useCapability } from '@harnessio/ai-chat-core'
import { useState } from 'react'

export function DrawerCapability() {
  const [drawerContent, setDrawerContent] = useState<{ title: string; content: string } | null>(null)

  useCapability({
    name: 'open_drawer',
    execute: async args => {
      setDrawerContent({ title: args.title, content: args.content })
      return { success: true }
    },
    render: ({ status, args }) => {
      if (status.type === 'running') {
        return (
          <div className="flex items-center gap-2 text-sm text-cn-foreground-3 py-1">
            <span className="animate-spin">⏳</span> Opening drawer...
          </div>
        )
      }

      if (status.type === 'complete') {
        return (
          <div className="flex items-center gap-2 text-sm text-green-600 py-1">
            ✓ Drawer opened: {args.title}
          </div>
        )
      }

      return null
    }
  })

  if (!drawerContent) return null

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-cn-background-1 border-l border-cn-borders-3 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-cn-borders-3">
        <h3 className="text-sm font-semibold text-cn-foreground-1">{drawerContent.title}</h3>
        <button
          type="button"
          onClick={() => setDrawerContent(null)}
          className="text-cn-foreground-4 hover:text-cn-foreground-1"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <p className="text-sm text-cn-foreground-2">{drawerContent.content}</p>
      </div>
    </div>
  )
}
