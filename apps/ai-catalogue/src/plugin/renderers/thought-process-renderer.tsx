import { Message, MessageContent } from '@harnessio/ai-chat-core'
import { useState } from 'react'

interface ThoughtProcessContent extends MessageContent {
  type: 'assistant_thought'
  data: string[]
}

export const ThoughtProcessRenderer = ({
  message,
  content
}: {
  message: Message
  content: ThoughtProcessContent
}) => {
  const isStreaming = content.status?.type === 'streaming' || (!content.status && message.status.type === 'running')
  const [isOpen, setIsOpen] = useState(isStreaming)

  const thoughts = Array.isArray(content.data) ? content.data : [content.data]

  return (
    <div className="border border-cn-borders-3 rounded-lg overflow-hidden my-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 text-left bg-cn-background-2 hover:bg-cn-background-3 transition-colors"
      >
        <span
          className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
        <span className="text-xs text-cn-foreground-3 font-medium">
          {isStreaming ? 'Thinking...' : 'Thought Process'}
        </span>
        {isStreaming && (
          <span className="ml-auto flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cn-foreground-4 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-cn-foreground-4 animate-pulse [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-cn-foreground-4 animate-pulse [animation-delay:0.4s]" />
          </span>
        )}
      </button>
      {isOpen && (
        <div className="px-3 py-2 space-y-1.5 border-t border-cn-borders-3">
          {thoughts.map((thought, idx) => (
            <p key={idx} className="text-xs text-cn-foreground-3 italic leading-relaxed">
              {thought}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
