import { AssistantThoughtContent, ChatPlugin, TextContent } from '../../../src'

export const defaultPlugin: ChatPlugin = {
  id: 'default',
  name: 'default',
  renderers: [
    {
      type: 'text',
      component: ({ content }) => {
        const textContent = content as TextContent
        return <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{textContent.data}</div>
      }
    },
    {
      type: 'assistant_thought',
      component: ({ content }) => {
        const thoughtContent = content as AssistantThoughtContent
        const thoughts = Array.isArray(thoughtContent.data) ? thoughtContent.data : [thoughtContent.data]

        return (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#6b7280',
              fontStyle: 'italic'
            }}
          >
            {thoughts.map((thought, index) => (
              <div key={index}>💭 {thought}</div>
            ))}
          </div>
        )
      }
    }
  ]
}
