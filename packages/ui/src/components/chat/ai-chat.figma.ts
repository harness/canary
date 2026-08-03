// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=17470-45076
// source=packages/ui/src/components/chat/chat.tsx
// component=Chat

import figma from 'figma'

// AiChat's `container` slot holds the actual conversation content, which isn't a Figma property of
// this component (it's consumer-composed message-by-message). This shows a representative,
// illustrative example — the real message list and input handlers are wired up by the consumer.
// Note: Chat.Header has no title prop — it renders a hardcoded "Harness AI" title, so the Figma
// component's `title text` property can't be reflected here.
export default {
  example: figma.code`
    <Chat.Root>
      <Chat.Header onClose={() => {}} />
      <Chat.Body>
        <Chat.Message>Ask me anything about your pipeline.</Chat.Message>
      </Chat.Body>
      <Chat.Footer>
        <Chat.Input onSend={() => {}} />
      </Chat.Footer>
    </Chat.Root>
  `,
  imports: ['import { Chat } from "@harnessio/ui/components"'],
  id: 'ai-chat',
  metadata: {
    nestable: false
  }
}
