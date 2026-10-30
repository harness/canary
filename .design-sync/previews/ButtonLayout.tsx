import * as React from 'react'
import { Button, ButtonLayout } from '@harnessio/ui'

const wrap: React.CSSProperties = { width: 480, padding: 16 }

export function EndAligned() {
  return (
    <div style={wrap}>
      <ButtonLayout.Root horizontalAlign="end">
        <ButtonLayout.Secondary><Button variant="outline">Cancel</Button></ButtonLayout.Secondary>
        <ButtonLayout.Primary><Button>Save pipeline</Button></ButtonLayout.Primary>
      </ButtonLayout.Root>
    </div>
  )
}

export function StartAligned() {
  return (
    <div style={wrap}>
      <ButtonLayout.Root horizontalAlign="start">
        <ButtonLayout.Primary><Button>Create repository</Button></ButtonLayout.Primary>
        <ButtonLayout.Secondary><Button variant="outline">Import</Button></ButtonLayout.Secondary>
      </ButtonLayout.Root>
    </div>
  )
}

export function Vertical() {
  return (
    <div style={{ width: 240, padding: 16 }}>
      <ButtonLayout.Root orientation="vertical">
        <ButtonLayout.Primary><Button>Deploy to production</Button></ButtonLayout.Primary>
        <ButtonLayout.Secondary><Button variant="outline">Deploy to staging</Button></ButtonLayout.Secondary>
      </ButtonLayout.Root>
    </div>
  )
}
