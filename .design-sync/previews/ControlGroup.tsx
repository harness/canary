import * as React from 'react'
import { ControlGroup, Text, TextInput, Button } from '@harnessio/ui'

export function Vertical() {
  return (
    <div style={{ width: 400, padding: 16 }}>
      <ControlGroup.Root>
        <ControlGroup.LabelWrapper>
          <Text as="label" variant="body-strong">Repository name</Text>
        </ControlGroup.LabelWrapper>
        <ControlGroup.InputWrapper>
          <TextInput placeholder="harness-core" />
        </ControlGroup.InputWrapper>
      </ControlGroup.Root>
    </div>
  )
}

export function Horizontal() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <ControlGroup.Root orientation="horizontal">
        <ControlGroup.LabelWrapper>
          <Text as="label" variant="body-strong">Default branch</Text>
        </ControlGroup.LabelWrapper>
        <ControlGroup.InputWrapper>
          <TextInput placeholder="main" />
        </ControlGroup.InputWrapper>
      </ControlGroup.Root>
    </div>
  )
}

export function ButtonType() {
  return (
    <div style={{ width: 400, padding: 16 }}>
      <ControlGroup.Root type="button">
        <ControlGroup.InputWrapper>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </ControlGroup.InputWrapper>
      </ControlGroup.Root>
    </div>
  )
}
