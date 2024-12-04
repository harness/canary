import { useQueryClient } from '@tanstack/react-query'

import { useCreateBranchMutation, useListBranchesQuery, UsererrorError } from '@harnessio/code-service-client'
import { CreateBranchDialog, ICreateBranchForm } from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'

interface CreateBranchDialogContainerProps {
  open: boolean
  onClose: () => void
}

export default function CreateBranchDialogContainer({ open, onClose }: CreateBranchDialogContainerProps) {
  const repoRef = useGetRepoRef()
  const queryClient = useQueryClient()

  const { data: { body: branches } = {}, isLoading: isLoadingBranches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {}
  })
  const { mutateAsync: saveBranch, isLoading: isSaving, error } = useCreateBranchMutation({})

  const onSubmit = async (formValues: ICreateBranchForm) => {
    const { name, target } = formValues

    try {
      await saveBranch({
        repo_ref: repoRef,
        body: { name, target, bypass_rules: false }
      })
      queryClient.invalidateQueries({ queryKey: ['listBranches'] })
      onClose()
    } catch (e) {
      console.log(e, 'error')
    }
  }

  return (
    <CreateBranchDialog
      open={open}
      onClose={onClose}
      isLoadingBranches={isLoadingBranches}
      isSaving={isSaving}
      error={(error as UsererrorError)?.message}
      onSubmit={onSubmit}
      branches={branches}
    />
  )
}
