import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useCreatePipelineMutation, useListBranchesQuery } from '@harnessio/code-service-client'
import { CreatePipelineDialog as CreatePipelineDialogView, CreatePipelineFormType } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'
import { apiBranches2BranchNames, apiBranches2DefaultBranchName } from '../repo/transform-utils/branch-transform'
import { useCreatePipelineStore } from './stores/create-pipeline-dialog.store'

interface CreatePipelineDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreatePipelineDialog({ open, onClose }: CreatePipelineDialogProps) {
  const routes = useRoutes()
  const { repoId } = useParams<PathParams>()
  const spaceId = useGetSpaceURLParam()
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()

  const { setBranchesState, setError } = useCreatePipelineStore()

  const { data: { body: branches } = {}, isLoading: isLoadingBranchNames } = useListBranchesQuery(
    {
      repo_ref: repoRef,
      queryParams: {}
    },
    { enabled: open }
  )

  useEffect(() => {
    const branchNames = apiBranches2BranchNames(branches)
    const defaultBranch = apiBranches2DefaultBranchName(branches)

    setBranchesState({ isLoadingBranchNames, branchNames, defaultBranch })
  }, [branches, isLoadingBranchNames])

  const { mutateAsync: savePipeline } = useCreatePipelineMutation({})

  const onSubmit = async (formValues: CreatePipelineFormType) => {
    const { branch, name, yamlPath } = formValues

    try {
      await savePipeline({
        repo_ref: repoRef,
        body: { config_path: yamlPath, default_branch: branch, identifier: name }
      })

      navigate(routes.toPipelineEdit({ spaceId, repoId, pipelineId: name }))
    } catch (e: any) {
      if ('message' in e) {
        setError({ message: e.message })
      }
    }
  }

  const onCloseInternal = useCallback(() => {
    setError(undefined)
    onClose()
  }, [setError, onClose])

  return (
    <CreatePipelineDialogView
      isOpen={open}
      onClose={onCloseInternal}
      onSubmit={onSubmit}
      onCancel={onCloseInternal}
      useCreatePipelineStore={useCreatePipelineStore}
    />
  )
}
