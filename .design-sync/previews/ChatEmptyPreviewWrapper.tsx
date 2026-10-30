import * as React from 'react'
import { ChatEmptyPreviewWrapper, Text } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 520, height: 320, display: 'flex' }}>
      <ChatEmptyPreviewWrapper>
        <Text>Generated pipeline previews will appear here.</Text>
      </ChatEmptyPreviewWrapper>
    </div>
  )
}
