import { useCallback, useEffect, useState } from 'react'

import { useCreateBranchMutation } from '@harnessio/code-service-client'
import { useToastNotification } from '@harnessio/ui/components'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CreateBranchDialog as CreateBranchDialogComp,
  CreateBranchFormFields
} from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { BranchSelectorContainer } from './branch-selector-container'

interface CreateBranchDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  preselectedBranchOrTag?: BranchSelectorListItem | null
  preselectedTab?: BranchSelectorTab
}

export const CreateBranchDialog = ({
  open,
  onClose,
  onSuccess,
  preselectedBranchOrTag,
  preselectedTab
}: CreateBranchDialogProps) => {
  const repo_ref = useGetRepoRef()

  const { t } = useTranslationStore()
  const [selectedBranchOrTag, setSelectedBranchOrTag] = useState<BranchSelectorListItem | null>(null)

  const [createdBranchName, setCreatedBranchName] = useState('')

  const selectBranchOrTag = useCallback((branchTagName: BranchSelectorListItem) => {
    setSelectedBranchOrTag(branchTagName)
  }, [])

  const { showToast } = useToastNotification({
    title: t('views:repos.branchCreated'),
    description: t('views:repos.branchCreatedDescription', { name: createdBranchName })
  })

  const {
    mutateAsync: createBranch,
    error: createBranchError,
    isLoading: isCreatingBranch,
    reset: resetBranchMutation
  } = useCreateBranchMutation(
    {},
    {
      onSuccess: data => {
        onClose()
        setCreatedBranchName(data.body.name ?? '')
        showToast()
        onSuccess?.()
      }
    }
  )

  const handleCreateBranch = async (data: CreateBranchFormFields) => {
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
      useTranslationStore={useTranslationStore}
      open={open}
      onClose={onClose}
      selectedBranchOrTag={selectedBranchOrTag}
      onSubmit={handleCreateBranch}
      isCreatingBranch={isCreatingBranch}
      error={createBranchError?.message}
      renderProp={() => (
        <BranchSelectorContainer
          onSelectBranchorTag={selectBranchOrTag}
          selectedBranch={selectedBranchOrTag}
          preSelectedTab={preselectedTab}
        />
      )}
    />
  )
}
