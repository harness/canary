import * as React from 'react'
import { CheckboxTree } from '@harnessio/ui'

function Demo({ initial, showSelectAll, showCount, disabled }: { initial: string[]; showSelectAll?: boolean; showCount?: boolean; disabled?: boolean }) {
  const [ids, setIds] = React.useState<string[]>(initial)
  return (
    <div style={{ width: 380, padding: 16 }}>
      <CheckboxTree.Root
        selectedIds={ids}
        onSelectionChange={setIds}
        defaultExpandedIds={['pipelines', 'repos']}
        showSelectAll={showSelectAll}
        selectAllLabel="All permissions"
        showCount={showCount}
        disabled={disabled}
      >
        <CheckboxTree.Group id="pipelines" label="Pipelines">
          <CheckboxTree.Item id="pipelines.view" label="View" />
          <CheckboxTree.Item id="pipelines.execute" label="Execute" />
          <CheckboxTree.Item id="pipelines.edit" label="Edit" />
        </CheckboxTree.Group>
        <CheckboxTree.Group id="repos" label="Repositories">
          <CheckboxTree.Item id="repos.view" label="View" />
          <CheckboxTree.Item id="repos.push" label="Push" />
          <CheckboxTree.Item id="repos.delete" label="Delete" />
        </CheckboxTree.Group>
      </CheckboxTree.Root>
    </div>
  )
}

export function Default() {
  return <Demo initial={['pipelines.view', 'pipelines.execute', 'repos.view']} />
}

export function SelectAllWithCount() {
  return <Demo initial={['pipelines.view', 'pipelines.execute', 'pipelines.edit']} showSelectAll showCount />
}

export function Disabled() {
  return <Demo initial={['repos.view']} disabled />
}
