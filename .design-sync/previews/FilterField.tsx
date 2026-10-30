import * as React from 'react'
import { FilterField } from '@harnessio/ui'

const statusOption: any = {
  label: 'Status',
  value: 'status',
  type: 'multiselect',
  filterFieldConfig: {
    options: [
      { label: 'Success', value: 'success' },
      { label: 'Failed', value: 'failed' },
      { label: 'Running', value: 'running' }
    ]
  }
}

const branchOption: any = { label: 'Branch', value: 'branch', type: 'text', filterFieldConfig: { placeholder: 'Branch name' } }

export function MultiSelect() {
  const [v, setV] = React.useState<any>([{ label: 'Failed', value: 'failed' }, { label: 'Running', value: 'running' }])
  return (
    <div style={{ width: 420, height: 160, padding: 16 }}>
      <FilterField filterOption={statusOption} removeFilter={() => {}} shouldOpenFilter={false} value={v} onChange={setV} />
    </div>
  )
}

export function TextOutline() {
  const [v, setV] = React.useState<any>('release/2.4')
  return (
    <div style={{ width: 420, height: 160, padding: 16 }}>
      <FilterField filterOption={branchOption} removeFilter={() => {}} shouldOpenFilter={false} value={v} onChange={setV} variant="outline" />
    </div>
  )
}
