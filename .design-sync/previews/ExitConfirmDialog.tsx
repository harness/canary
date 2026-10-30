import * as React from 'react'
import { ExitConfirmDialog } from '@harnessio/ui'

export function UnsavedChanges() {
  return (
    <ExitConfirmDialog
      open
      title="Discard pipeline changes?"
      subtitle="Your edits to build-and-deploy have not been saved."
      confirmText="Discard"
      cancelText="Keep editing"
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )
}

export function WithError() {
  return (
    <ExitConfirmDialog
      open
      title="Leave repository setup?"
      subtitle="The repository will be created without branch protection rules."
      error="Could not save draft: request timed out."
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )
}
