import { useCapability } from '@harnessio/ai-chat-core'

export function NavigateCapability() {
  useCapability({
    name: 'navigate',
    execute: async args => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true, destination: args.path || args.url }
    },
    render: ({ status, args }) => {
      if (status.type === 'running') {
        return (
          <div className="flex items-center gap-2 text-sm text-cn-foreground-3 py-1">
            <span className="animate-spin">⏳</span> Navigating to {args.path || args.url || 'page'}...
          </div>
        )
      }

      if (status.type === 'complete') {
        return (
          <div className="flex items-center gap-2 text-sm text-green-600 py-1">
            ✓ Navigated to {args.path || args.url || 'page'}
          </div>
        )
      }

      if (status.type === 'error') {
        return (
          <div className="flex items-center gap-2 text-sm text-red-600 py-1">
            ✗ Navigation failed: {status.error}
          </div>
        )
      }

      return null
    }
  })

  return null
}
