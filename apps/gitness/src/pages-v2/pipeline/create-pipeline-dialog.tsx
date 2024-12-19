import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useCreatePipelineMutation, useFindRepositoryQuery, useListBranchesQuery } from '@harnessio/code-service-client'
import { CreatePipelineDialog as CreatePipelineDialogView, CreatePipelineFormType } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'
import { apiBranches2BranchNames, apiRepository2DefaultBranchName } from '../repo/transform-utils/branch-transform'

interface CreatePipelineDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreatePipelineDialog({ open, onClose }: CreatePipelineDialogProps) {
  const { repoId } = useParams<PathParams>()
  const spaceId = useGetSpaceURLParam()
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()

  const { data: { body: branches } = {}, isLoading: isLoadingBranchNames } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {}
  })
  const branchNames = useMemo(() => apiBranches2BranchNames(branches), [branches])

  const { data: { body: repositoryData } = {}, isLoading: isLoadingDefaultBranch } = useFindRepositoryQuery({
    repo_ref: repoRef
  })
  const defaultBranch = useMemo(() => apiRepository2DefaultBranchName(repositoryData), [repositoryData])

  const { mutateAsync: savePipeline } = useCreatePipelineMutation({})

  const onSubmit = async (formValues: CreatePipelineFormType) => {
    const { branch, name, yamlPath } = formValues

    try {
      await savePipeline({
        repo_ref: repoRef,
        body: { config_path: yamlPath, default_branch: branch, identifier: name }
      })

      navigate(`/spaces/${spaceId}/repos/${repoId}/pipelines/${name}/edit`)
    } catch (e) {
      //TODO: Handle error by showing toast
      console.log(e, 'error')
    }
  }

  return (
    <CreatePipelineDialogView
      isOpen={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCancel={onClose}
      isLoadingBranchNames={isLoadingBranchNames}
      branchNames={branchNames}
      defaultBranch={defaultBranch}
      isLoadingDefaultBranch={isLoadingDefaultBranch}
    />
  )
}
