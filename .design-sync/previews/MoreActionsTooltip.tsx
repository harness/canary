import * as React from 'react'
import { MoreActionsTooltip } from '@harnessio/ui'

const actions = [
  { title: 'Edit pipeline', iconName: 'edit-pencil', onClick: () => {} },
  { title: 'Clone', iconName: 'copy', onClick: () => {} },
  { title: 'Delete', iconName: 'trash', isDanger: true, onClick: () => {} }
]

export function Default() {
  return (
    <div style={{ width: 260, height: 200, padding: 16 }}>
      <MoreActionsTooltip actions={actions as any} />
    </div>
  )
}
