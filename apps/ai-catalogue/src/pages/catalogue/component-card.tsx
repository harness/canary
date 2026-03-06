import { CatalogueEntry, ContentRenderer, Message, MessageContent, MessageRendererProps } from '@harnessio/ai-chat-core'
import { useMemo, useState } from 'react'

import { EventOverlay } from '../../components/event-overlay'
import { JsonViewer } from '../../components/json-viewer'

interface ComponentCardProps {
  entry: CatalogueEntry & { type: string; component: React.ComponentType<MessageRendererProps> }
}

const CATEGORY_STYLES: Record<string, string> = {
  core: 'bg-cn-blue-secondary text-cn-blue-secondary',
  feedback: 'bg-cn-warning-secondary text-cn-warning-secondary',
  capability: 'bg-cn-purple-secondary text-cn-purple-secondary',
  custom: 'bg-cn-success-secondary text-cn-success-secondary'
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
    <div className="border border-cn-3 rounded-cn-4 overflow-hidden bg-cn-1 hover:shadow-cn-2 transition-shadow">
      {/* Header */}
      <div className="px-cn-md py-cn-sm border-b border-cn-3 flex items-start justify-between">
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <div className="flex items-center gap-cn-xs mb-cn-4xs">
            <h3 className="text-cn-size-2 font-semibold text-cn-1">{entry.displayName}</h3>
            <span className={`px-cn-xs py-cn-4xs text-cn-size-0 font-medium rounded-cn-full ${CATEGORY_STYLES[entry.category] ?? 'bg-cn-gray-secondary text-cn-gray-secondary'}`}>
              {entry.category}
            </span>
            {entry.supportsStreaming && (
              <span className="px-cn-xs py-cn-4xs text-cn-size-0 font-medium rounded-cn-full bg-cn-cyan-secondary text-cn-cyan-secondary">
                streaming
              </span>
            )}
          </div>
          <p className="text-cn-size-1 text-cn-3 leading-relaxed">{entry.description}</p>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-cn-4xs mt-cn-xs">
              {entry.tags.map(tag => (
                <span key={tag} className="px-cn-3xs py-cn-4xs text-cn-size-0 bg-cn-3 text-cn-3 rounded-cn-2">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <code className="text-cn-size-0 font-mono bg-cn-3 px-cn-3xs py-cn-4xs rounded-cn-2 text-cn-2 ml-cn-sm shrink-0">
          {entry.type}
        </code>
      </div>

      {/* Live Preview */}
      <EventOverlay entry={entry}>
        <div className="px-cn-md py-cn-md bg-cn-2" style={{ minHeight: 60 }}>
          <div className="text-cn-size-0 text-cn-4 uppercase tracking-wider mb-cn-xs font-medium">
            Live Preview
          </div>
          <ContentRenderer message={mockMessage} content={entry.mockContent as MessageContent} />
        </div>
      </EventOverlay>

      {/* Event Toggle */}
      <div className="border-t border-cn-3">
        <button
          type="button"
          onClick={() => setShowEvents(!showEvents)}
          className="w-full px-cn-md py-cn-xs text-cn-size-1 text-cn-3 hover:text-cn-1 hover:bg-cn-2 transition-colors flex items-center gap-cn-3xs"
        >
          <span className={`transition-transform ${showEvents ? 'rotate-90' : ''}`} style={{ display: 'inline-block' }}>&#9654;</span>
          {showEvents ? 'Hide' : 'Show'} Backend Events
        </button>

        {showEvents && (
          <div className="px-cn-md pb-cn-md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-sm)' }}>
            <div>
              <h4 className="text-cn-size-0 font-medium text-cn-2 mb-cn-3xs uppercase tracking-wider">
                SSE Events (what the backend sends)
              </h4>
              {entry.backendEvents.map((event, idx) => (
                <div key={idx} className="bg-cn-2 rounded-cn-2 px-cn-sm py-cn-xs font-mono text-cn-size-0 mb-cn-3xs last:mb-0">
                  <div>
                    <span className="text-cn-brand">event:</span>{' '}
                    <span className="text-cn-1">{event.eventName}</span>
                  </div>
                  <div>
                    <span className="text-cn-brand">data:</span>{' '}
                    <span className="text-cn-2">{JSON.stringify(event.examplePayload)}</span>
                  </div>
                </div>
              ))}
            </div>
            <JsonViewer data={entry.mockContent} title="MessageContent (stored in message)" />
          </div>
        )}
      </div>
    </div>
  )
}
