import { CatalogueEntry } from '@harnessio/ai-chat-core'
import { useState } from 'react'

import { JsonViewer } from './json-viewer'

interface EventOverlayProps {
  entry: CatalogueEntry
  children: React.ReactNode
}

export function EventOverlay({ entry, children }: EventOverlayProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <div
          className="absolute right-0 top-0 z-40 bg-cn-1 border border-cn-3 rounded-cn-4 shadow-cn-4 p-cn-sm overflow-auto"
          style={{ width: 380, maxHeight: 500, display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-sm)' }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-cn-size-0 font-semibold text-cn-1 uppercase tracking-wider">Event Data</h4>
            <span className="text-cn-size-0 text-cn-4">Hover to inspect</span>
          </div>

          <div>
            <h5 className="text-cn-size-0 font-medium text-cn-2 mb-cn-3xs">Backend SSE Events</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-3xs)' }}>
              {entry.backendEvents.map((event, idx) => (
                <div key={idx} className="bg-cn-2 rounded-cn-2 px-cn-xs py-cn-xs font-mono text-cn-size-0">
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
          </div>

          <JsonViewer data={entry.mockContent} title="MessageContent" maxHeight="150px" />
        </div>
      )}
    </div>
  )
}
