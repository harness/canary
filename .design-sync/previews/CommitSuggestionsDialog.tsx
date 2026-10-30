import * as React from 'react'
import { CommitSuggestionsDialog } from '@harnessio/ui'

export function Open() {
  return (
    <CommitSuggestionsDialog
      isOpen
      isSubmitting={false}
      commitTitlePlaceHolder="Apply suggestion to src/pipeline/stage.ts"
      onClose={() => {}}
      onFormSubmit={async () => {}}
    />
  )
}

export function WithError() {
  return (
    <CommitSuggestionsDialog
      isOpen
      isSubmitting={false}
      commitTitlePlaceHolder="Apply suggestion to src/pipeline/stage.ts"
      error={{ message: 'Branch protection rule blocks direct commits to main.' } as any}
      onClose={() => {}}
      onFormSubmit={async () => {}}
    />
  )
}
