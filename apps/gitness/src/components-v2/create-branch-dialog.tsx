import { useCallback, useEffect, useState } from 'react'

import { useCreateBranchMutation } from '@harnessio/code-service-client'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CreateBranchDialog as CreateBranchDialogComp,
  CreateBranchFormFields
} from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
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

  const [selectedBranchOrTag, setSelectedBranchOrTag] = useState<BranchSelectorListItem | null>(null)

  const selectBranchOrTag = useCallback((branchTagName: BranchSelectorListItem) => {
    setSelectedBranchOrTag(branchTagName)
  }, [])

  const {
    mutateAsync: createBranch,
    error: createBranchError,
    isLoading: isCreatingBranch,
    reset: resetBranchMutation
  } = useCreateBranchMutation(
    {},
    {
      onSuccess: () => {
        onClose()
        onSuccess?.()
      }
    }
  )

  const handleCreateBranch = async (data: CreateBranchFormFields) => {
    onBranchQueryChange?.(data.name)
    await createBranch({
      repo_ref,
      body: {
        ...data
      }
    })
  }

  useEffect(() => {
    if (!open) {
      resetBranchMutation()
    }
  }, [open, resetBranchMutation])

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
      error={createBranchError?.message}
      prefilledName={prefilledName}
      renderProp={
        <BranchSelectorContainer
          onSelectBranchorTag={selectBranchOrTag}
          selectedBranch={selectedBranchOrTag}
          preSelectedTab={preselectedTab}
          dynamicWidth
        />
      }
    />
  )
}
