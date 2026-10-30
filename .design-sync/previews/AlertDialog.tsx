import * as React from 'react'
import { AlertDialog } from '@harnessio/ui'

export function Danger() {
  return (
    <AlertDialog.Root open theme="danger" onConfirm={() => {}} onCancel={() => {}}>
      <AlertDialog.Content title="Delete repository">
        This permanently deletes payments-api along with its branches and pull requests.
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export function Warning() {
  return (
    <AlertDialog.Root open theme="warning" onConfirm={() => {}} onCancel={() => {}}>
      <AlertDialog.Content title="Force push to main">
        Force pushing rewrites history and may break open pull requests.
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
