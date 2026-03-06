import { CatalogueEntry, ContentRenderer, Message, MessageContent } from '@harnessio/ai-chat-core'
import { useMemo, useState } from 'react'

import { EventOverlay } from '../../components/event-overlay'
import { JsonViewer } from '../../components/json-viewer'

interface ComponentCardProps {
  entry: CatalogueEntry & { type: string; component: React.ComponentType }
}

const CATEGORY_COLORS: Record<string, string> = {
  core: 'bg-blue-100 text-blue-700',
  feedback: 'bg-amber-100 text-amber-700',
  capability: 'bg-purple-100 text-purple-700',
  custom: 'bg-green-100 text-green-700'
}

export function ComponentCard({ entry }: ComponentCardProps) {
  const [showEvents, setShowEvents] = useState(false)

  const mockMessage: Message = useMemo(
    () => ({
      id: `mock-${entry.type}`,
      role: (entry.mockMessage?.role as 'user' | 'assistant') ?? 'assistant',
      content: [entry.mockContent as MessageContent],
      status: entry.mockMessage?.status ?? { type: 'complete' },
      timestamp: Date.now()
    }),
    [entry]
  )

  return (
    <div className="border border-cn-borders-3 rounded-xl overflow-hidden bg-cn-background-1 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-cn-borders-3 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-cn-foreground-1">{entry.displayName}</h3>
            <span
              className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${CATEGORY_COLORS[entry.category] ?? 'bg-gray-100 text-gray-700'}`}
            >
              {entry.category}
            </span>
            {entry.supportsStreaming && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-cyan-100 text-cyan-700">
                streaming
              </span>
            )}
          </div>
          <p className="text-xs text-cn-foreground-3 leading-relaxed">{entry.description}</p>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-cn-background-3 text-cn-foreground-3 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-3">
          <code className="text-[10px] font-mono bg-cn-background-3 px-1.5 py-0.5 rounded text-cn-foreground-2">
            {entry.type}
          </code>
        </div>
      </div>

      {/* Live Preview */}
      <EventOverlay entry={entry}>
        <div className="px-4 py-4 bg-cn-background-2 min-h-[60px]">
          <div className="text-[10px] text-cn-foreground-4 uppercase tracking-wider mb-2 font-medium">
            Live Preview
          </div>
          <div className="relative">
            <ContentRenderer message={mockMessage} content={entry.mockContent as MessageContent} />
          </div>
        </div>
      </EventOverlay>

      {/* Event Toggle */}
      <div className="border-t border-cn-borders-3">
        <button
          type="button"
          onClick={() => setShowEvents(!showEvents)}
          className="w-full px-4 py-2 text-xs text-cn-foreground-3 hover:text-cn-foreground-1 hover:bg-cn-background-2 transition-colors flex items-center gap-1.5"
        >
          <span className={`transition-transform ${showEvents ? 'rotate-90' : ''}`}>▶</span>
          {showEvents ? 'Hide' : 'Show'} Backend Events
        </button>

        {showEvents && (
          <div className="px-4 pb-4 space-y-3">
            {/* SSE Events */}
            <div>
              <h4 className="text-[11px] font-medium text-cn-foreground-2 mb-1.5 uppercase tracking-wider">
                SSE Events (what the backend sends)
              </h4>
              {entry.backendEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-cn-background-2 rounded px-3 py-2 font-mono text-[11px] mb-1.5 last:mb-0"
                >
                  <div>
                    <span className="text-blue-500">event:</span>{' '}
                    <span className="text-cn-foreground-1">{event.eventName}</span>
                  </div>
                  <div>
                    <span className="text-blue-500">data:</span>{' '}
                    <span className="text-cn-foreground-2">{JSON.stringify(event.examplePayload)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* MessageContent */}
            <JsonViewer data={entry.mockContent} title="MessageContent (stored in message)" />
          </div>
        )}
      </div>
    </div>
  )
}
