import * as React from 'react'
import { FormCaption } from '@harnessio/ui'

export function Themes() {
  return (
    <div style={{ width: 420, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FormCaption>Used as the display name in pipeline lists.</FormCaption>
      <FormCaption theme="success">Repository name is available.</FormCaption>
      <FormCaption theme="warning">This branch has no protection rules.</FormCaption>
      <FormCaption theme="danger">A pipeline with this identifier already exists.</FormCaption>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <FormCaption disabled>Identifier is locked after creation.</FormCaption>
    </div>
  )
}
