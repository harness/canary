import * as React from 'react'
import { SplitButton } from '@harnessio/ui'

const options = [
  { value: 'merge', label: 'Create merge commit', description: 'All commits are added to the base branch.' },
  { value: 'squash', label: 'Squash and merge', description: 'Combine commits into one.' },
  { value: 'rebase', label: 'Rebase and merge', description: 'Replay commits onto the base branch.' }
]

export function MergePullRequest() {
  const [value, setValue] = React.useState('squash')
  return (
    <div style={{ padding: 16 }}>
      <SplitButton
        options={options}
        selectedValue={value}
        handleOptionChange={setValue}
        handleButtonClick={() => {}}
      >
        Squash and merge
      </SplitButton>
    </div>
  )
}

export function Secondary() {
  const [value, setValue] = React.useState('merge')
  return (
    <div style={{ padding: 16 }}>
      <SplitButton
        variant="outline"
        size="sm"
        options={options}
        selectedValue={value}
        handleOptionChange={setValue}
        handleButtonClick={() => {}}
      >
        Create merge commit
      </SplitButton>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ padding: 16 }}>
      <SplitButton
        options={options}
        selectedValue="merge"
        handleOptionChange={() => {}}
        handleButtonClick={() => {}}
        disabled
      >
        Merge blocked
      </SplitButton>
    </div>
  )
}
