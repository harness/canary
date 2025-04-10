import { FC } from 'react'

import { Button, Chat, ChatDiffViewer, Icon } from '@/components'

const diffData =
  'diff --git a/packages/ui/src/shared-style-variables.css b/packages/ui/src/shared-style-variables.css\n' +
  'index 68ad3fe8a7a992512924a537e5407fed671d645d..d7a93ea2d4900655ba8938218edec1524a4bb3da 100644\n' +
  '--- a/packages/ui/src/shared-style-variables.css\n' +
  '+++ b/packages/ui/src/shared-style-variables.css\n' +
  '@@ -292,7 +290,5 @@\n' +
  '     },\n' +
  '     Issue: Scm.Issue}\n' +
  '-             Title: src.Resource.PullRequest.Description,\n' +
  '-    Link: src.Resource.PullRequest.URL,\n' +
  '-             Body: src.Resource.PullRequest.Description,\n' +
  '+    Title: src.Resource.PullRequest.Description,\n' +
  '+    Author: scm.User{\n' +
  '+    Body: src.Resource.PullRequest.Description,\n'

export const ChatPreviewWrapper: FC = () => {
  return (
    <div className="border-cn-borders-4 h-[calc(100vh-100px)] border-r">
      <Chat.Root>
        <Chat.Header onClose={() => {}} />
        <Chat.Body>
          <Chat.Message>
            Hey Olivia! I&#39;ve finished with the requirements doc! I made some notes in the gdoc as well for Phoenix
            to look over.
          </Chat.Message>
          <Chat.Message self>Awesome! Thanks, I&#39;ll take a look at this today.</Chat.Message>
          <Chat.Message
            actions={
              <Button
                className="flex h-6 gap-x-1 rounded bg-cn-background-8 px-2.5 text-cn-foreground-1 hover:bg-cn-background-9 hover:text-cn-foreground-1"
                size="sm"
                variant="custom"
              >
                <Icon className="shrink-0 text-icons-9" name="repo-icon" size={12} />
                main
              </Button>
            }
          >
            No rush though — we still have to wait for Lana&#39;s design. Click the button in the actions panel below to
            see branches which require your attention to fix and redeploy.
          </Chat.Message>
          <Chat.Message>
            Hey Olivia, can you please review the latest design when you have a chance?
            <ChatDiffViewer data={diffData} fileName="scm/driver/azure/webhook.go" />
          </Chat.Message>
          <Chat.Message self>
            Sure thing, I&#39;ll have a look today. They&#39;re looking great! Here&#39;s some code to make it better
            though:
            <Chat.CodeBlock>hello world</Chat.CodeBlock>
          </Chat.Message>
          <Chat.Typing />
        </Chat.Body>
        <Chat.Footer>
          <Chat.Input />
        </Chat.Footer>
      </Chat.Root>
    </div>
  )
}
