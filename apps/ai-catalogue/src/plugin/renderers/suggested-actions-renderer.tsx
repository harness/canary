interface SuggestedActionsContent {
  type: 'suggested_actions'
  data: {
    title?: string
    actions: string[]
  }
}

export const SuggestedActionsRenderer = ({ content }: { content: SuggestedActionsContent }) => {
  const actions = content?.data?.actions ?? []
  const title = content?.data?.title

  return (
    <div className="space-y-2">
      {title && <p className="text-xs text-cn-foreground-3 font-medium">{title}</p>}
      <div className="flex flex-wrap gap-2">
        {actions.map((action, idx) => (
          <button
            key={idx}
            type="button"
            className="px-3 py-1.5 text-sm rounded-full border border-cn-borders-3 text-cn-foreground-2 hover:bg-cn-background-3 hover:text-cn-foreground-1 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}
