import { useCallback, useEffect, useState } from 'react'

import { useCreateBranchMutation, UsererrorError } from '@harnessio/code-service-client'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CreateBranchDialog as CreateBranchDialogComp,
  CreateBranchFormFields
} from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useRuleViolationCheck } from '../framework/hooks/useRuleViolationCheck'
import { BranchSelectorContainer } from './branch-selector-container'

interface CreateBranchDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  preselectedBranchOrTag?: BranchSelectorListItem | null
  preselectedTab?: BranchSelectorTab
  prefilledName?: string
  onBranchQueryChange?: (query: string) => void
}

export const CreateBranchDialog = ({
  open,
  onClose,
  onSuccess,
  preselectedBranchOrTag,
  preselectedTab,
  prefilledName,
  onBranchQueryChange
}: CreateBranchDialogProps) => {
  const repo_ref = useGetRepoRef()
  const [error, setError] = useState<UsererrorError>()
  const [selectedBranchOrTag, setSelectedBranchOrTag] = useState<BranchSelectorListItem | null>(null)
  const { violation, bypassable, bypassed, setAllStates, resetViolation } = useRuleViolationCheck()

  const selectBranchOrTag = useCallback((branchTagName: BranchSelectorListItem, _type: BranchSelectorTab) => {
    setSelectedBranchOrTag(branchTagName)
  }, [])

  const handleMutationSuccess = useCallback(() => {
    setError(undefined)
    resetViolation()
    onClose()
    onSuccess?.()
  }, [onClose, onSuccess, resetViolation])

  const handleMutationError = useCallback(
    (err: any) => {
      if (err?.violations?.length > 0) {
        setAllStates({
          violation: true,
          bypassed: true,
          bypassable: err?.violations[0]?.bypassable
        })
      } else {
        setError(err as UsererrorError)
      }
    },
    [setAllStates]
  )

  const {
    mutateAsync: createBranch,
    isLoading: isCreatingBranch,
    reset: resetBranchMutation
  } = useCreateBranchMutation({}, { onSuccess: handleMutationSuccess, onError: handleMutationError })

  const handleCreateBranch = async (data: CreateBranchFormFields) => {
    onBranchQueryChange?.(data.name)
    setError(undefined)
    resetViolation()
    await createBranch({
      repo_ref,
      body: {
        ...data,
        bypass_rules: bypassed
      }
    })
  }

  useEffect(() => {
    if (open) {
      setError(undefined)
      resetViolation()
    } else {
      resetBranchMutation()
      setError(undefined)
      resetViolation()
    }
  }, [open])

  useEffect(() => {
    if (preselectedBranchOrTag) {
      setSelectedBranchOrTag(preselectedBranchOrTag)
    }
  }, [open, preselectedBranchOrTag])

  return (
    <CreateBranchDialogComp
      open={open}
      onClose={onClose}
      selectedBranchOrTag={selectedBranchOrTag}
      onSubmit={handleCreateBranch}
      isCreatingBranch={isCreatingBranch}
      error={error?.message}
      prefilledName={prefilledName}
      violation={violation}
      bypassable={bypassable}
      resetViolation={resetViolation}
      renderProp={
        <BranchSelectorContainer
          onSelectBranchorTag={selectBranchOrTag}
          className={'branch-selector-trigger-as-input'}
          selectedBranch={selectedBranchOrTag}
          preSelectedTab={preselectedTab}
          dynamicWidth
        />
      }
    />
  )
}
