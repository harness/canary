import * as React from 'react'
import { Chat } from '@harnessio/ui'

const frame: React.CSSProperties = { width: 520, height: 420, display: 'flex' }

export function Conversation() {
  return (
    <div style={frame}>
      <Chat.Root>
        <Chat.Header onClose={() => {}}>Pipeline assistant</Chat.Header>
        <Chat.Body>
          <Chat.Separator title="Today" />
          <Chat.Message self>Why did the last build of checkout-service fail?</Chat.Message>
          <Chat.Message>The integration-tests stage failed because the postgres service did not become healthy within 60 seconds.</Chat.Message>
          <Chat.Message self>Can you retry it with a longer timeout?</Chat.Message>
          <Chat.Typing>Updating the stage config</Chat.Typing>
        </Chat.Body>
        <Chat.Footer>
          <Chat.Input value="" placeholder="Ask about your pipelines" onChange={() => {}} onSend={() => {}} />
        </Chat.Footer>
      </Chat.Root>
    </div>
  )
}

export function EmptyState() {
  return (
    <div style={frame}>
      <Chat.Root>
        <Chat.Header onClose={() => {}}>Pipeline assistant</Chat.Header>
        <Chat.Body>
          <Chat.EmptyState>Ask me to explain a failed run or draft a pipeline.</Chat.EmptyState>
        </Chat.Body>
        <Chat.Footer>
          <Chat.Input value="" placeholder="Ask about your pipelines" onChange={() => {}} onSend={() => {}} />
        </Chat.Footer>
      </Chat.Root>
    </div>
  )
}

export function WithCode() {
  return (
    <div style={frame}>
      <Chat.Root>
        <Chat.Body>
          <Chat.Message self>Show me a step that caches node_modules.</Chat.Message>
          <Chat.Message>
            Add this step before install:
            <Chat.CodeBlock>{`- step:\n    type: Cache\n    spec:\n      key: node-{{ checksum "pnpm-lock.yaml" }}\n      paths: [node_modules]`}</Chat.CodeBlock>
          </Chat.Message>
        </Chat.Body>
      </Chat.Root>
    </div>
  )
}
