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
        <div className="absolute right-0 top-0 z-40 w-96 bg-cn-background-1 border border-cn-borders-3 rounded-lg shadow-xl p-3 space-y-3 max-h-[500px] overflow-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-cn-foreground-1 uppercase tracking-wider">Event Data</h4>
            <span className="text-[10px] text-cn-foreground-4">Hover to inspect</span>
          </div>

          {/* Backend SSE Events */}
          <div>
            <h5 className="text-[11px] font-medium text-cn-foreground-2 mb-1.5">Backend SSE Events</h5>
            <div className="space-y-1.5">
              {entry.backendEvents.map((event, idx) => (
                <div key={idx} className="bg-cn-background-2 rounded px-2.5 py-2 font-mono text-[11px]">
                  <div className="text-blue-500">
                    event: <span className="text-cn-foreground-1">{event.eventName}</span>
                  </div>
                  <div className="text-blue-500">
                    data:{' '}
                    <span className="text-cn-foreground-2">{JSON.stringify(event.examplePayload)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MessageContent */}
          <JsonViewer data={entry.mockContent} title="MessageContent" maxHeight="150px" />
        </div>
      )}
    </div>
  )
}
