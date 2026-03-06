import { ContentRenderer, useComposer, useCurrentThread, useMessages } from '@harnessio/ai-chat-core'
import { useMemo, useRef, useEffect, useState } from 'react'

import { EventOverlay } from '../../components/event-overlay'
import { JsonViewer } from '../../components/json-viewer'
import { cataloguePlugin } from '../../plugin/catalogue-plugin'

export function PlaygroundPage() {
  const messages = useMessages()
  const { text, setText, send, isSubmitting } = useComposer()
  const thread = useCurrentThread()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [inspectedMessageId, setInspectedMessageId] = useState<string | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const rendererMap = useMemo(() => {
    const map = new Map<string, (typeof cataloguePlugin.renderers)[0]>()
    cataloguePlugin.renderers.forEach(r => {
      if (r.catalogue) map.set(r.type, r)
    })
    return map
  }, [])

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b border-cn-borders-3 bg-cn-background-2">
          <h3 className="text-sm font-semibold text-cn-foreground-1">
            {thread.title || 'Chat Playground'}
          </h3>
          <p className="text-xs text-cn-foreground-3 mt-0.5">
            Send messages to see how the chat runtime processes events. Hover over content to inspect event data.
          </p>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-cn-foreground-4">
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm">Send a message to start the demo</p>
                <p className="text-xs mt-1">The mock adapter will simulate a full assistant response</p>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-cn-foreground-4 uppercase tracking-wider font-medium px-1">
                {message.role}
              </span>
              <div
                className="max-w-[85%] space-y-2 relative"
                onMouseEnter={() => setInspectedMessageId(message.id)}
                onMouseLeave={() => setInspectedMessageId(null)}
              >
                {message.content.map((content, idx) => {
                  const renderer = rendererMap.get(content.type)
                  const wrapper = renderer?.catalogue ? (
                    <EventOverlay key={idx} entry={renderer.catalogue}>
                      <ContentRenderer message={message} content={content} />
                    </EventOverlay>
                  ) : (
                    <ContentRenderer key={idx} message={message} content={content} />
                  )
                  return wrapper
                })}

                {message.role === 'assistant' &&
                  message.status.type === 'running' &&
                  !message.content.some(c => c.status?.type === 'streaming') && (
                    <div className="flex gap-1 py-2">
                      <span className="w-2 h-2 rounded-full bg-cn-foreground-4 animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-cn-foreground-4 animate-pulse [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-cn-foreground-4 animate-pulse [animation-delay:0.4s]" />
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-cn-borders-3 p-4 bg-cn-background-2">
          <form
            onSubmit={send}
            className="flex gap-2"
          >
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type a message to trigger the mock stream..."
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 text-sm border border-cn-borders-3 rounded-lg bg-cn-background-1 text-cn-foreground-1 placeholder:text-cn-foreground-4 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Message Inspector */}
      <div className="w-80 border-l border-cn-borders-3 flex flex-col bg-cn-background-2">
        <div className="px-4 py-3 border-b border-cn-borders-3">
          <h3 className="text-xs font-semibold text-cn-foreground-1 uppercase tracking-wider">
            Message Inspector
          </h3>
        </div>
        <div className="flex-1 overflow-auto p-3">
          {inspectedMessageId ? (
            (() => {
              const msg = messages.find(m => m.id === inspectedMessageId)
              if (!msg) return <p className="text-xs text-cn-foreground-4">Message not found</p>
              return (
                <div className="space-y-3">
                  <JsonViewer data={{ id: msg.id, role: msg.role, status: msg.status }} title="Message" />
                  <JsonViewer data={msg.content} title={`Content (${msg.content.length} items)`} maxHeight="400px" />
                  {msg.metadata && <JsonViewer data={msg.metadata} title="Metadata" />}
                </div>
              )
            })()
          ) : messages.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-cn-foreground-3 mb-3">Hover over a message to inspect its data.</p>
              <JsonViewer
                data={{
                  totalMessages: messages.length,
                  roles: messages.map(m => m.role),
                  contentCounts: messages.map(m => m.content.length)
                }}
                title="Thread Summary"
              />
            </div>
          ) : (
            <p className="text-xs text-cn-foreground-4 text-center mt-8">
              Send a message to see data here
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
