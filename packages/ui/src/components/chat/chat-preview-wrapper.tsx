import { FC } from 'react'

import { Button, Chat, ChatDiffViewer, Icon } from '@/components'

import { diffData } from './chat-diff-store'

export const ChatPreviewWrapper: FC = () => {
  return (
    <div className="max-w-[460px] h-full border-r border-borders-4">
      <Chat.Root>
        <Chat.Body>
          <Chat.Message>
            Hey Olivia! I&#39;ve finished with the requirements doc! I made some notes in the gdoc as well for Phoenix
            to look over.
          </Chat.Message>
          <Chat.Message self>Awesome! Thanks, I&#39;ll take a look at this today.</Chat.Message>
          <Chat.Message>
            No rush though — we still have to wait for Lana&#39;s design. Click the button in the actions panel below to
            see branches which require your attention to fix and redeploy.
            <Button
              className="flex mt-3 h-6 px-2.5 gap-x-1 bg-background-8 rounded text-foreground-8"
              size="sm"
              variant="custom"
            >
              <Icon className="shrink-0" name="repo-icon" size={12} />
              main
            </Button>
          </Chat.Message>
          <Chat.Message>
            Hey Olivia, can you please review the latest design when you have a chance?
            <ChatDiffViewer data={diffData} fileName="scm/driver/azure/webhook.go" />
          </Chat.Message>
          <Chat.Message self>Sure thing, I&#39;ll have a look today. They&#39;re looking great!</Chat.Message>
          <Chat.Typing />
        </Chat.Body>
        <Chat.Footer>
          <Chat.Input />
        </Chat.Footer>
      </Chat.Root>
    </div>
  )
}
