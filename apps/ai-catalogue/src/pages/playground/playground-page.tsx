import { ContentRenderer, useComposer, useCurrentThread, useMessages } from '@harnessio/ai-chat-core'
import { defaultPlugin } from '@harnessio/ai-chat-components'
import { useEffect, useMemo, useRef, useState } from 'react'

import { EventOverlay } from '../../components/event-overlay'
import { JsonViewer } from '../../components/json-viewer'

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
    const map = new Map<string, (typeof defaultPlugin.renderers)[0]>()
    defaultPlugin.renderers.forEach(r => {
      if (r.catalogue) map.set(r.type, r)
    })
    return map
  }, [])

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="px-cn-md py-cn-sm border-b border-cn-3 bg-cn-2">
          <h3 className="text-cn-size-3 font-semibold text-cn-1">
            {thread.title || 'Chat Playground'}
          </h3>
          <p className="text-cn-size-1 text-cn-3 mt-cn-4xs">
            Send messages to see how the chat runtime processes events. Hover over content to inspect event data.
          </p>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto p-cn-md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-md)' }}>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-cn-4">
                <p className="text-cn-size-2">Send a message to start the demo</p>
                <p className="text-cn-size-1 mt-cn-4xs">The mock adapter will simulate a full assistant response</p>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex flex-col gap-cn-xs ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-cn-size-0 text-cn-4 uppercase tracking-wider font-medium px-cn-4xs">
                {message.role}
              </span>
              <div
                style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-xs)' }}
                onMouseEnter={() => setInspectedMessageId(message.id)}
                onMouseLeave={() => setInspectedMessageId(null)}
              >
                {message.content.map((content, idx) => {
                  const renderer = rendererMap.get(content.type)
                  if (renderer?.catalogue) {
                    return (
                      <EventOverlay key={idx} entry={renderer.catalogue}>
                        <ContentRenderer message={message} content={content} />
                      </EventOverlay>
                    )
                  }
                  return <ContentRenderer key={idx} message={message} content={content} />
                })}

                {message.role === 'assistant' &&
                  message.status.type === 'running' &&
                  !message.content.some(c => c.status?.type === 'streaming') && (
                    <div className="flex gap-cn-4xs py-cn-xs">
                      <span className="w-2 h-2 rounded-cn-full bg-cn-4 animate-pulse" />
                      <span className="w-2 h-2 rounded-cn-full bg-cn-4 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 rounded-cn-full bg-cn-4 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-cn-3 p-cn-md bg-cn-2">
          <form onSubmit={send} className="flex gap-cn-xs">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type a message to trigger the mock stream..."
              disabled={isSubmitting}
              className="flex-1 px-cn-sm py-cn-xs text-cn-size-2 border border-cn-3 rounded-cn-3 bg-cn-1 text-cn-1 placeholder:text-cn-4 focus:outline-none focus:ring-1 focus:ring-cn-brand disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="px-cn-md py-cn-xs text-cn-size-2 font-medium rounded-cn-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-cn-brand-primary text-cn-brand-primary hover:bg-cn-brand-primary-hover"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Message Inspector */}
      <div className="w-80 border-l border-cn-3 flex flex-col bg-cn-2 shrink-0">
        <div className="px-cn-md py-cn-sm border-b border-cn-3">
          <h3 className="text-cn-size-0 font-semibold text-cn-1 uppercase tracking-wider">
            Message Inspector
          </h3>
        </div>
        <div className="flex-1 overflow-auto p-cn-sm">
          {inspectedMessageId ? (
            (() => {
              const msg = messages.find(m => m.id === inspectedMessageId)
              if (!msg) return <p className="text-cn-size-1 text-cn-4">Message not found</p>
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-sm)' }}>
                  <JsonViewer data={{ id: msg.id, role: msg.role, status: msg.status }} title="Message" />
                  <JsonViewer data={msg.content} title={`Content (${msg.content.length} items)`} maxHeight="400px" />
                  {msg.metadata && <JsonViewer data={msg.metadata} title="Metadata" />}
                </div>
              )
            })()
          ) : messages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cn-layout-sm)' }}>
              <p className="text-cn-size-1 text-cn-3 mb-cn-sm">Hover over a message to inspect its data.</p>
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
            <p className="text-cn-size-1 text-cn-4 text-center mt-cn-2xl">
              Send a message to see data here
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
