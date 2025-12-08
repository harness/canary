import './playground.css'

import ChatExample from './examples/chat-example'
import { ChatRuntime } from './providers/ChatRuntimeProvider'

function App() {
  return (
    <ChatRuntime>
      <div className="demo-holder">
        <ChatExample />
      </div>
    </ChatRuntime>
  )
}

export default App
