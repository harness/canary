import { FC } from 'react'

import { Chat } from '@/components'

export const ChatEmptyPreviewWrapper: FC = () => {
  return (
    <div className="border-cn-borders-4 h-[calc(100vh-var(--cn-page-nav-height))] border-r">
      <Chat.Root>
        <Chat.Body>
          <Chat.EmptyState />
        </Chat.Body>
        <Chat.Footer>
          <Chat.Input />
        </Chat.Footer>
      </Chat.Root>
    </div>
  )
}
