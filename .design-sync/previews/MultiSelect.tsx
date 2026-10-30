import * as React from 'react'
import { MultiSelect } from '@harnessio/ui'

const options = [
  { id: 1, key: 'frontend' },
  { id: 2, key: 'backend' },
  { id: 3, key: 'infra' },
  { id: 4, key: 'release' }
]

export function WithSelection() {
  const [v, setV] = React.useState([options[0], options[2]])
  return (
    <div style={{ width: 380, padding: 16 }}>
      <MultiSelect label="Labels" options={options} value={v} onChange={setV} placeholder="Add labels" />
    </div>
  )
}
export function Empty() {
  const [v, setV] = React.useState<any[]>([])
  return (
    <div style={{ width: 380, padding: 16 }}>
      <MultiSelect label="Reviewers" caption="Select who reviews this PR" options={options} value={v} onChange={setV} placeholder="Search..." />
    </div>
  )
}
export function WithError() {
  return (
    <div style={{ width: 380, padding: 16 }}>
      <MultiSelect label="Environments" options={options} value={[]} error="Select at least one environment" placeholder="Add environment" />
    </div>
  )
}
