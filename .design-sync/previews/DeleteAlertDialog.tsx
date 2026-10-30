import * as React from 'react'
import { DeleteAlertDialog } from '@harnessio/ui'

export function Simple() {
  return (
    <DeleteAlertDialog
      open
      onClose={() => {}}
      deleteFn={() => {}}
      identifier="nightly-regression"
      type="pipeline"
      message="This removes the pipeline and its execution history."
    />
  )
}

export function WithConfirmForm() {
  return (
    <DeleteAlertDialog
      open
      onClose={() => {}}
      deleteFn={() => {}}
      identifier="harness-core"
      type="repository"
      withForm
      deletionItemName="harness-core"
      deletionKeyword="DELETE"
    />
  )
}

export function WithError() {
  return (
    <DeleteAlertDialog
      open
      onClose={() => {}}
      deleteFn={() => {}}
      identifier="prod-cluster"
      type="environment"
      error={{ message: 'Environment is referenced by 3 active pipelines.' }}
    />
  )
}
