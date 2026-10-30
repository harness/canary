import * as React from 'react'
import { Spacer, Text, Button } from '@harnessio/ui'

const box = { padding: 16, width: 320 }
const swatch = { background: 'var(--cn-bg-3, #ddd)', borderRadius: 4, padding: 8 }

export function Sizes() {
  return (
    <div style={box}>
      <div style={swatch}><Text>Pipeline: build-and-test</Text></div>
      <Spacer size={2} />
      <div style={swatch}><Text>size 2</Text></div>
      <Spacer size={5} />
      <div style={swatch}><Text>size 5</Text></div>
      <Spacer size={10} />
      <div style={swatch}><Text>size 10</Text></div>
    </div>
  )
}

export function BetweenContent() {
  return (
    <div style={box}>
      <Text variant="heading-base">Deploy to production</Text>
      <Spacer size={3} />
      <Text color="foreground-3">Release v2.14.0 will roll out to 3 regions.</Text>
      <Spacer size={6} />
      <Button>Start deployment</Button>
    </div>
  )
}
