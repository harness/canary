import {
  CatalogueEntry,
  ContentRenderer,
  extractCatalogueEntries,
  Message,
  MessageContent
} from '@harnessio/ai-chat-core'
import { useCallback, useMemo, useState } from 'react'

import { EventOverlay } from '../../components/event-overlay'
import { JsonViewer } from '../../components/json-viewer'
import { cataloguePlugin } from '../../plugin/catalogue-plugin'

interface DroppedItem {
  id: string
  entry: CatalogueEntry & { type: string; component: React.ComponentType }
  content: MessageContent
}

const CATEGORY_COLORS: Record<string, string> = {
  core: 'border-blue-300 bg-blue-50',
  feedback: 'border-amber-300 bg-amber-50',
  capability: 'border-purple-300 bg-purple-50',
  custom: 'border-green-300 bg-green-50'
}

let dragCounter = 0

export function ComposerPage() {
  const entries = useMemo(() => extractCatalogueEntries(cataloguePlugin), [])
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDragStart = useCallback(
    (e: React.DragEvent, entry: CatalogueEntry & { type: string; component: React.ComponentType }) => {
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
      // invalid JSON, ignore
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
      {/* Left Panel: Draggable tiles */}
      <div className="w-56 border-r border-cn-borders-3 p-4 overflow-auto bg-cn-background-2">
        <h3 className="text-xs font-semibold text-cn-foreground-1 uppercase tracking-wider mb-3">
          Content Types
        </h3>
        <p className="text-[11px] text-cn-foreground-3 mb-4">Drag content types into the message builder.</p>
        <div className="space-y-2">
          {entries.map(entry => (
            <div
              key={entry.type}
              draggable
              onDragStart={e => handleDragStart(e, entry)}
              className={`px-3 py-2.5 border rounded-lg cursor-grab active:cursor-grabbing transition-all hover:shadow-sm ${CATEGORY_COLORS[entry.category] ?? 'border-gray-300 bg-gray-50'}`}
            >
              <div className="text-xs font-medium text-cn-foreground-1">{entry.displayName}</div>
              <div className="text-[10px] text-cn-foreground-3 mt-0.5">
                <code>{entry.type}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel: Drop zone / Message builder */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-cn-foreground-1">Message Builder</h3>
          <p className="text-xs text-cn-foreground-3 mt-0.5">
            Drop content types here to build a message. Click the edit button to modify mock data.
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 border-2 border-dashed rounded-xl p-4 transition-colors min-h-[300px] ${
            isDragOver
              ? 'border-blue-400 bg-blue-50/50'
              : droppedItems.length > 0
                ? 'border-cn-borders-3'
                : 'border-cn-borders-3 bg-cn-background-2'
          }`}
        >
          {droppedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-cn-foreground-4">
              <div className="text-center">
                <p className="text-3xl mb-2">+</p>
                <p className="text-sm">Drop content types here</p>
                <p className="text-xs mt-1">Build a message by dragging components from the left panel</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-cn-foreground-4 uppercase tracking-wider font-medium">
                  Message.content[{droppedItems.length}]
                </span>
                <button
                  type="button"
                  onClick={() => setDroppedItems([])}
                  className="text-[11px] text-cn-foreground-4 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              {droppedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-cn-borders-3 rounded-lg bg-cn-background-1 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-3 py-1.5 bg-cn-background-2 border-b border-cn-borders-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-cn-foreground-4 font-mono">
                        [{index}]
                      </span>
                      <span className="text-xs font-medium text-cn-foreground-1">
                        {item.entry.displayName}
                      </span>
                      <code className="text-[10px] text-cn-foreground-3 bg-cn-background-3 px-1 rounded">
                        {item.entry.type}
                      </code>
                    </div>
                    <div className="flex items-center gap-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, index - 1)}
                          className="text-[11px] text-cn-foreground-4 hover:text-cn-foreground-1 px-1"
                        >
                          ↑
                        </button>
                      )}
                      {index < droppedItems.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, index + 1)}
                          className="text-[11px] text-cn-foreground-4 hover:text-cn-foreground-1 px-1"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                        className="text-[11px] text-cn-foreground-4 hover:text-blue-500 px-1"
                      >
                        {editingId === item.id ? 'Done' : 'Edit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[11px] text-cn-foreground-4 hover:text-red-500 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {editingId === item.id ? (
                    <div className="p-3">
                      <textarea
                        defaultValue={JSON.stringify(item.content, null, 2)}
                        onBlur={e => handleUpdateContent(item.id, e.target.value)}
                        className="w-full h-32 font-mono text-xs bg-cn-background-2 border border-cn-borders-3 rounded p-2 text-cn-foreground-1 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                      />
                    </div>
                  ) : (
                    <EventOverlay entry={item.entry}>
                      <div className="p-3">
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

      {/* Right Panel: Live preview */}
      <div className="w-80 border-l border-cn-borders-3 flex flex-col bg-cn-background-2">
        <div className="px-4 py-3 border-b border-cn-borders-3">
          <h3 className="text-xs font-semibold text-cn-foreground-1 uppercase tracking-wider">
            Live Preview
          </h3>
          <p className="text-[11px] text-cn-foreground-3 mt-0.5">
            How the composed message renders in chat
          </p>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {droppedItems.length === 0 ? (
            <p className="text-xs text-cn-foreground-4 text-center mt-8">
              Add content types to see a preview
            </p>
          ) : (
            <div className="space-y-3">
              {droppedItems.map((item, idx) => (
                <ContentRenderer key={idx} message={composedMessage} content={item.content} />
              ))}
            </div>
          )}
        </div>
        {droppedItems.length > 0 && (
          <div className="border-t border-cn-borders-3 p-3">
            <JsonViewer
              data={composedMessage.content}
              title="Message.content[]"
              maxHeight="150px"
            />
          </div>
        )}
      </div>
    </div>
  )
}
