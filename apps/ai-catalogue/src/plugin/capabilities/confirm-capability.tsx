import { useCapability } from '@harnessio/ai-chat-core'

export function ConfirmCapability() {
  useCapability({
    name: 'confirm_action',
    execute: async args => {
      const confirmed = window.confirm(args.message || 'Are you sure you want to proceed?')
      return { success: confirmed, confirmed }
    },
    render: ({ status, args }) => {
      if (status.type === 'running') {
        return (
          <div className="flex items-center gap-2 text-sm text-cn-foreground-3 py-1">
            <span className="animate-spin">⏳</span> Waiting for confirmation...
          </div>
        )
      }

      if (status.type === 'complete') {
        const result = status.result as { confirmed: boolean } | undefined
        return (
          <div
            className={`flex items-center gap-2 text-sm py-1 ${result?.confirmed ? 'text-green-600' : 'text-amber-600'}`}
          >
            {result?.confirmed ? '✓' : '✗'} {args.message || 'Action'}: {result?.confirmed ? 'Confirmed' : 'Cancelled'}
          </div>
        )
      }

      return null
    }
  })

  return null
}
