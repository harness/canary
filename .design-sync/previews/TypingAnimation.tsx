import * as React from 'react'
import { TypingAnimation } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16, width: 420 }}>
      <TypingAnimation text="Analyzing failed pipeline build-and-deploy #1284..." typingSpeed={1} />
    </div>
  )
}

export function Brand() {
  return (
    <div style={{ padding: 16, width: 420 }}>
      <TypingAnimation text="Suggested fix: pin node to 20.11 in the build step." color="brand" typingSpeed={1} />
    </div>
  )
}
