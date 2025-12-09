import './playground.css'

import { useCapability } from '../../src'
import ChatExample from './examples/chat-example'
import { ChatRuntime } from './providers/ChatRuntimeProvider'

function NavigationCapability() {
  // ✅ Use any hooks you need!

  useCapability({
    name: 'navigate',
    execute: async args => {
      await new Promise(resolve => setTimeout(resolve, 2000))

      return { success: true }
    },
    render: ({ status, args }) => {
      if (status.type === 'running') {
        return <div>Navigating...</div>
      }

      if (status.type === 'complete') {
        return <div>Navigated to {args.path}</div>
      }

      return null
    }
  })

  return null // Just registers, doesn't render
}

function GlobalCapabilities() {
  return (
    <>
      <NavigationCapability />
    </>
  )
}

function App() {
  return (
    <ChatRuntime>
      <GlobalCapabilities />
      <div className="demo-holder">
        <ChatExample />
      </div>
    </ChatRuntime>
  )
}

export default App
