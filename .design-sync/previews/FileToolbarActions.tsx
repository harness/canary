import * as React from 'react'
import { FileToolbarActions } from '@harnessio/ui'

const yaml = 'pipeline:\n  name: build-and-deploy\n  stages:\n    - build\n    - deploy'

export function Default() {
  return (
    <div style={{ padding: 16 }}>
      <FileToolbarActions copyContent={yaml} onDownloadClick={() => {}} onEditClick={() => {}} />
    </div>
  )
}

export function WithEdit() {
  return (
    <div style={{ padding: 16 }}>
      <FileToolbarActions copyContent={yaml} onDownloadClick={() => {}} onEditClick={() => {}} showEdit />
    </div>
  )
}
