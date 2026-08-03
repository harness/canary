// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=17470-51704
// source=packages/ui/src/components/chat/message-bubble.tsx
// component=MessageBubble

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#17592:0')
const hasFooter = instance.getBoolean('ViewFooter#27077:1')
const timestamp = hasFooter ? instance.getString('timestampString#27077:0') : null

export default {
  example: figma.code`
    <MessageBubble.Root role="assistant">
      <MessageBubble.Content>
        <MessageBubble.Text>${text}</MessageBubble.Text>
      </MessageBubble.Content>
      ${hasFooter ? figma.code`<MessageBubble.Footer>${timestamp}</MessageBubble.Footer>` : ''}
    </MessageBubble.Root>
  `,
  imports: ['import { MessageBubble } from "@harnessio/ui/components"'],
  id: 'message-bubble',
  metadata: {
    nestable: true
  }
}
