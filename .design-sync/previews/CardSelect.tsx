import * as React from 'react'
import { CardSelect } from '@harnessio/ui'

export function Horizontal() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <CardSelect.Root type="single" defaultValue="rolling" layout="horizontal">
        <CardSelect.Item value="rolling" icon="rocket">
          <CardSelect.Title>Rolling</CardSelect.Title>
          <CardSelect.Description>Replace instances in batches.</CardSelect.Description>
        </CardSelect.Item>
        <CardSelect.Item value="canary" icon="bug">
          <CardSelect.Title>Canary</CardSelect.Title>
          <CardSelect.Description>Shift traffic gradually.</CardSelect.Description>
        </CardSelect.Item>
        <CardSelect.Item value="bluegreen" icon="layers">
          <CardSelect.Title>Blue-green</CardSelect.Title>
          <CardSelect.Description>Swap two environments.</CardSelect.Description>
        </CardSelect.Item>
      </CardSelect.Root>
    </div>
  )
}

export function Multiple() {
  return (
    <div style={{ width: 360, padding: 16 }}>
      <CardSelect.Root type="multiple" defaultValue={['slack']} layout="vertical">
        <CardSelect.Item value="slack">
          <CardSelect.Title>Slack</CardSelect.Title>
          <CardSelect.Description>Notify #deployments on failure.</CardSelect.Description>
        </CardSelect.Item>
        <CardSelect.Item value="email">
          <CardSelect.Title>Email</CardSelect.Title>
          <CardSelect.Description>Send a summary to the owning team.</CardSelect.Description>
        </CardSelect.Item>
      </CardSelect.Root>
    </div>
  )
}
