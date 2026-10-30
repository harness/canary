import * as React from 'react'
import { Radio } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16 }}>
      <Radio.Root label="Deployment strategy" defaultValue="rolling">
        <Radio.Item value="rolling" label="Rolling" caption="Replace instances gradually" />
        <Radio.Item value="bluegreen" label="Blue/Green" caption="Switch traffic at once" />
        <Radio.Item value="canary" label="Canary" caption="Shift traffic in steps" />
      </Radio.Root>
    </div>
  )
}
export function Horizontal() {
  return (
    <div style={{ padding: 16 }}>
      <Radio.Root orientation="horizontal" defaultValue="main">
        <Radio.Item value="main" label="main" />
        <Radio.Item value="develop" label="develop" />
      </Radio.Root>
    </div>
  )
}
export function Disabled() {
  return (
    <div style={{ padding: 16 }}>
      <Radio.Root defaultValue="a" disabled>
        <Radio.Item value="a" label="Production" />
        <Radio.Item value="b" label="Staging" />
      </Radio.Root>
    </div>
  )
}
