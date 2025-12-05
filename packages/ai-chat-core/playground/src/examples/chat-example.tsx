import { ContentRenderer, useComposer, useMessages } from '../../../src'

function ChatExample() {
  const messages = useMessages()
  const { text, setText, send, isSubmitting } = useComposer()

  return (
    <div
      style={{
        width: '450px',
        height: '100vh',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
          fontSize: '16px'
        }}
      >
        AI Chat
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: message.role === 'user' ? '#f3f4f6' : '#eff6ff'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase'
              }}
            >
              {message.role}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {message.content.map((content, idx) => (
                <ContentRenderer key={idx} message={message} content={content} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb'
        }}
      >
        <form onSubmit={send} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type your message..."
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: isSubmitting || !text.trim() ? '#d1d5db' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: isSubmitting || !text.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatExample
