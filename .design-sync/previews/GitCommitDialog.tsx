import * as React from 'react'
import { GitCommitDialog } from '@harnessio/ui'

const base = {
  isOpen: true,
  currentBranch: 'main',
  violation: false,
  bypassable: false,
  disableCTA: false,
  isSubmitting: false,
  onClose: () => {},
  onFormSubmit: async () => {},
  setAllStates: () => {},
  dryRun: () => {}
} as any

export function Default() {
  return <GitCommitDialog {...base} commitTitlePlaceHolder="Update pipeline.yaml" />
}

export function NewFile() {
  return <GitCommitDialog {...base} isFileNameRequired currentBranch="feature/ci-cache" />
}

export function RuleViolation() {
  return <GitCommitDialog {...base} violation bypassable />
}
