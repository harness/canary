import { MessageContent } from '@harnessio/ai-chat-core'

interface ErrorContent extends MessageContent<string> {
  type: 'error'
}

export const ErrorRenderer = ({ content }: { content: ErrorContent }) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 max-w-[85%]">
      <span className="text-red-500 mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </span>
      <p className="text-sm text-red-700">{content.data || 'An error occurred'}</p>
    </div>
  )
}
