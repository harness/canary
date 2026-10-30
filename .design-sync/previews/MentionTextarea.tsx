import * as React from 'react'
import { MentionTextarea } from '@harnessio/ui'

const items = [
  { id: '1', value: 'alice', label: 'Alice Chen' },
  { id: '2', value: 'bob', label: 'Bob Martinez' },
  { id: '3', value: 'priya', label: 'Priya Natarajan' }
]

export function Default() {
  const [v, setV] = React.useState('Can @[alice] review the deploy pipeline changes?')
  return (
    <div style={{ width: 420, padding: 16 }}>
      <MentionTextarea label="Comment" value={v} onValueChange={setV} items={items} placeholder="Write a comment..." />
    </div>
  )
}

export function Empty() {
  const [v, setV] = React.useState('')
  return (
    <div style={{ width: 420, padding: 16 }}>
      <MentionTextarea
        label="Reply"
        caption="Type @ to mention a teammate"
        value={v}
        onValueChange={setV}
        items={items}
        placeholder="Reply to this thread..."
      />
    </div>
  )
}

export function WithError() {
  const [v, setV] = React.useState('LGTM')
  return (
    <div style={{ width: 420, padding: 16 }}>
      <MentionTextarea label="Review" error="Comment must be at least 10 characters" value={v} onValueChange={setV} items={items} />
    </div>
  )
}
