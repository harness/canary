import { useState } from 'react'

interface FeedbackContent {
  type: 'feedback'
  data: {
    conversation_id?: string
    interaction_id?: string
  }
}

export const FeedbackRenderer = ({ content }: { content: FeedbackContent }) => {
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)

  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-xs text-cn-foreground-3">Was this helpful?</span>
      <button
        type="button"
        onClick={() => setSelected('up')}
        className={`p-1.5 rounded transition-colors ${
          selected === 'up'
            ? 'bg-green-100 text-green-600'
            : 'text-cn-foreground-4 hover:text-cn-foreground-2 hover:bg-cn-background-3'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 22V11M2 13V20C2 21.1 2.9 22 4 22H17.4C18.3 22 19.1 21.4 19.3 20.5L21.5 11.5C21.8 10.3 20.8 9 19.6 9H14V4C14 2.9 13.1 2 12 2L7 11" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setSelected('down')}
        className={`p-1.5 rounded transition-colors ${
          selected === 'down'
            ? 'bg-red-100 text-red-600'
            : 'text-cn-foreground-4 hover:text-cn-foreground-2 hover:bg-cn-background-3'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 2V13M22 11V4C22 2.9 21.1 2 20 2H6.6C5.7 2 4.9 2.6 4.7 3.5L2.5 12.5C2.2 13.7 3.2 15 4.4 15H10V20C10 21.1 10.9 22 12 22L17 13" />
        </svg>
      </button>
      {selected && (
        <span className="text-xs text-cn-foreground-3 ml-1">
          {selected === 'up' ? 'Thanks for the feedback!' : 'Sorry to hear that.'}
        </span>
      )}
    </div>
  )
}
