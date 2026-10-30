import * as React from 'react'
import { Fieldset, Input, Label, FormCaption } from '@harnessio/ui'

export function RepoDetails() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <Fieldset>
        <div>
          <Label>Repository name</Label>
          <Input defaultValue="web-app" />
          <FormCaption>Lowercase letters, numbers and hyphens.</FormCaption>
        </div>
        <div>
          <Label>Default branch</Label>
          <Input defaultValue="main" />
        </div>
      </Fieldset>
    </div>
  )
}
