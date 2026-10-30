import * as React from 'react'
import { MessageBubble } from '@harnessio/ui'

export function User() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <MessageBubble.Root role="user">
        <MessageBubble.Content>
          <MessageBubble.Text>Why did the deploy-staging stage fail on the last run?</MessageBubble.Text>
        </MessageBubble.Content>
      </MessageBubble.Root>
    </div>
  )
}

export function Assistant() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <MessageBubble.Root role="assistant">
        <MessageBubble.Content>
          <MessageBubble.Markdown>{'The **deploy-staging** stage failed because the `staging-cluster` connector timed out after 30s.\n\n- Check connector credentials\n- Retry the stage'}</MessageBubble.Markdown>
        </MessageBubble.Content>
      </MessageBubble.Root>
    </div>
  )
}

export function WithFooter() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <MessageBubble.Root role="assistant">
        <MessageBubble.Content>
          <MessageBubble.Text>I rolled back the release to v2.3.9.</MessageBubble.Text>
        </MessageBubble.Content>
        <MessageBubble.Footer>
          <MessageBubble.Text color="foreground-3">2 minutes ago</MessageBubble.Text>
        </MessageBubble.Footer>
      </MessageBubble.Root>
    </div>
  )
}
