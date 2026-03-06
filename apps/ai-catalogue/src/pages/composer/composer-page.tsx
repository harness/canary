import {
  CatalogueEntry,
  ContentRenderer,
  extractCatalogueEntries,
  Message,
  MessageContent,
  MessageRendererProps
} from '@harnessio/ai-chat-core'
import { defaultPlugin } from '@harnessio/ai-chat-components'
import { useCallback, useMemo, useState } from 'react'

import { EventOverlay } from '../../components/event-overlay'
import { JsonViewer } from '../../components/json-viewer'

interface DroppedItem {
  id: string
  entry: CatalogueEntry & { type: string; component: React.ComponentType<MessageRendererProps> }
  content: MessageContent
}

const CATEGORY_BORDERS: Record<string, string> = {
  core: 'border-cn-blue-outline',
  feedback: 'border-cn-warning-outline',
  capability: 'border-cn-purple-outline',
  custom: 'border-cn-success-outline'
}

let dragCounter = 0

export function ComposerPage() {
  const entries = useMemo(() => extractCatalogueEntries(defaultPlugin), [])
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDragStart = useCallback(
    (e: React.DragEvent, entry: CatalogueEntry & { type: string; component: React.ComponentType<MessageRendererProps> }) => {
      e.dataTransfer.setData('application/json', JSON.stringify({ type: entry.type }))
      e.dataTransfer.effectAllowed = 'copy'
    },
    []
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'))
        const entry = entries.find(ent => ent.type === data.type)
        if (entry) {
          setDroppedItems(prev => [
            ...prev,
            {
              id: `item-${++dragCounter}`,
              entry,
              content: JSON.parse(JSON.stringify(entry.mockContent))
            }
          ])
        }
      } catch {
        // invalid drag data
      }
    },
    [entries]
  )

  const handleRemoveItem = useCallback((id: string) => {
    setDroppedItems(prev => prev.filter(item => item.id !== id))
    setEditingId(null)
  }, [])

  const handleUpdateContent = useCallback((id: string, newContent: string) => {
    try {
      const parsed = JSON.parse(newContent)
      setDroppedItems(prev => prev.map(item => (item.id === id ? { ...item, content: parsed } : item)))
    } catch {
      // invalid JSON
    }
  }, [])

  const handleMoveItem = useCallback((fromIndex: number, toIndex: number) => {
    setDroppedItems(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  const composedMessage: Message = useMemo(
    () => ({
      id: 'composed-message',
      role: 'assistant',
      content: droppedItems.map(item => item.content),
      status: { type: 'complete' },
      timestamp: Date.now()
    }),
    [droppedItems]
  )

  return (
    <div className="flex h-full">
      {/* Left: draggable tiles */}
      <div className="w-56 border-r border-cn-3 p-cn-md overflow-auto bg-cn-2 shrink-0">
        <h3 className="text-cn-size-0 font-semibold text-cn-1 uppercase tracking-wider mb-cn-sm">
          Content Types
        </h3>
        <p className="text-cn-size-0 text-cn-3 mb-cn-md">Drag content types into the message builder.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-xs)' }}>
          {entries.map(entry => (
            <div
              key={entry.type}
              draggable
              onDragStart={e => handleDragStart(e, entry)}
              className={`px-cn-sm py-cn-xs border rounded-cn-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-cn-1 bg-cn-1 ${CATEGORY_BORDERS[entry.category] ?? 'border-cn-3'}`}
            >
              <div className="text-cn-size-1 font-medium text-cn-1">{entry.displayName}</div>
              <code className="text-cn-size-0 text-cn-3">{entry.type}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Center: drop zone */}
      <div className="flex-1 flex flex-col p-cn-md overflow-auto">
        <div className="mb-cn-md">
          <h3 className="text-cn-size-3 font-semibold text-cn-1">Message Builder</h3>
          <p className="text-cn-size-1 text-cn-3 mt-cn-4xs">
            Drop content types here to build a message. Click edit to modify mock data.
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 border-2 border-dashed rounded-cn-4 p-cn-md transition-colors ${
            isDragOver
              ? 'border-cn-brand bg-cn-brand-outline'
              : droppedItems.length > 0
                ? 'border-cn-3'
                : 'border-cn-3 bg-cn-2'
          }`}
          style={{ minHeight: 300 }}
        >
          {droppedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-cn-4">
              <div className="text-center">
                <p className="text-cn-size-7 mb-cn-xs">+</p>
                <p className="text-cn-size-2">Drop content types here</p>
                <p className="text-cn-size-1 mt-cn-4xs">Build a message by dragging components from the left panel</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-sm)' }}>
              <div className="flex items-center justify-between mb-cn-xs">
                <span className="text-cn-size-0 text-cn-4 uppercase tracking-wider font-medium">
                  Message.content[{droppedItems.length}]
                </span>
                <button
                  type="button"
                  onClick={() => setDroppedItems([])}
                  className="text-cn-size-0 text-cn-4 hover:text-cn-danger transition-colors"
                >
                  Clear all
                </button>
              </div>
              {droppedItems.map((item, index) => (
                <div key={item.id} className="border border-cn-3 rounded-cn-3 bg-cn-1 overflow-hidden">
                  <div className="flex items-center justify-between px-cn-sm py-cn-3xs bg-cn-2 border-b border-cn-3">
                    <div className="flex items-center gap-cn-xs">
                      <span className="text-cn-size-0 text-cn-4 font-mono">[{index}]</span>
                      <span className="text-cn-size-1 font-medium text-cn-1">{item.entry.displayName}</span>
                      <code className="text-cn-size-0 text-cn-3 bg-cn-3 px-cn-4xs rounded-cn-1">{item.entry.type}</code>
                    </div>
                    <div className="flex items-center gap-cn-4xs">
                      {index > 0 && (
                        <button type="button" onClick={() => handleMoveItem(index, index - 1)} className="text-cn-size-0 text-cn-4 hover:text-cn-1 px-cn-4xs">&#8593;</button>
                      )}
                      {index < droppedItems.length - 1 && (
                        <button type="button" onClick={() => handleMoveItem(index, index + 1)} className="text-cn-size-0 text-cn-4 hover:text-cn-1 px-cn-4xs">&#8595;</button>
                      )}
                      <button type="button" onClick={() => setEditingId(editingId === item.id ? null : item.id)} className="text-cn-size-0 text-cn-4 hover:text-cn-brand px-cn-4xs">
                        {editingId === item.id ? 'Done' : 'Edit'}
                      </button>
                      <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-cn-size-0 text-cn-4 hover:text-cn-danger px-cn-4xs">&#10005;</button>
                    </div>
                  </div>
                  {editingId === item.id ? (
                    <div className="p-cn-sm">
                      <textarea
                        defaultValue={JSON.stringify(item.content, null, 2)}
                        onBlur={e => handleUpdateContent(item.id, e.target.value)}
                        className="w-full font-mono text-cn-size-0 bg-cn-2 border border-cn-3 rounded-cn-2 p-cn-xs text-cn-1 focus:outline-none focus:ring-1 focus:ring-cn-brand resize-y"
                        style={{ height: 128 }}
                      />
                    </div>
                  ) : (
                    <EventOverlay entry={item.entry}>
                      <div className="p-cn-sm">
                        <ContentRenderer message={composedMessage} content={item.content} />
                      </div>
                    </EventOverlay>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: live preview */}
      <div className="w-80 border-l border-cn-3 flex flex-col bg-cn-2 shrink-0">
        <div className="px-cn-md py-cn-sm border-b border-cn-3">
          <h3 className="text-cn-size-0 font-semibold text-cn-1 uppercase tracking-wider">Live Preview</h3>
          <p className="text-cn-size-0 text-cn-3 mt-cn-4xs">How the composed message renders in chat</p>
        </div>
        <div className="flex-1 p-cn-md overflow-auto">
          {droppedItems.length === 0 ? (
            <p className="text-cn-size-1 text-cn-4 text-center mt-cn-2xl">Add content types to see a preview</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-sm)' }}>
              {droppedItems.map((item, idx) => (
                <ContentRenderer key={idx} message={composedMessage} content={item.content} />
              ))}
            </div>
          )}
        </div>
        {droppedItems.length > 0 && (
          <div className="border-t border-cn-3 p-cn-sm">
            <JsonViewer data={composedMessage.content} title="Message.content[]" maxHeight="150px" />
          </div>
        )}
      </div>
    </div>
  )
}
