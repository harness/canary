import {
  RepoSettingsGeneralPage,
  RepoUpdateData,
  SecurityScanning,
  AccessLevel,
  ErrorTypes,
  RepoData
} from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

import {
  useFindRepositoryQuery,
  FindRepositoryOkResponse,
  FindRepositoryErrorResponse,
  useListBranchesQuery,
  ListBranchesOkResponse,
  ListBranchesErrorResponse,
  useUpdateRepositoryMutation,
  UpdateRepositoryErrorResponse,
  useUpdateDefaultBranchMutation,
  UpdateDefaultBranchErrorResponse,
  useUpdatePublicAccessMutation,
  UpdatePublicAccessErrorResponse,
  useFindSecuritySettingsQuery,
  FindSecuritySettingsOkResponse,
  FindSecuritySettingsErrorResponse,
  useUpdateSecuritySettingsMutation,
  UpdateSecuritySettingsOkResponse,
  UpdateSecuritySettingsErrorResponse,
  useDeleteRepositoryMutation,
  DeleteRepositoryOkResponse,
  DeleteRepositoryErrorResponse
} from '@harnessio/code-service-client'
import { useQueryClient } from '@tanstack/react-query'

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const RepoSettingsGeneralPageContainer = () => {
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const spaceId = useGetSpaceURLParam()
  const queryClient = useQueryClient()

  const [repoData, setRepoData] = useState<RepoData>({
    name: '',
    description: '',
    defaultBranch: '',
    isPublic: false,
    branches: []
  })
  const [securityScanning, setSecurityScanning] = useState<boolean>(false)
  const [apiError, setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)

  const { isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onSuccess: (data: FindRepositoryOkResponse) => {
        setRepoData({
          name: data.identifier || '',
          description: data.description || '',
          defaultBranch: data.default_branch || '',
          isPublic: data.is_public ?? false,
          branches: []
        })
        setApiError(null)
      },
      onError: (error: FindRepositoryErrorResponse) => {
        const message = error.message || 'Error fetching repo'
        setApiError({ type: ErrorTypes.FETCH_REPO, message })
      }
    }
  )

  const { isLoading: isLoadingBranches } = useListBranchesQuery(
    {
      repo_ref: repoRef,
      queryParams: {
        include_commit: false,
        order: 'asc',
        page: 1,
        limit: 100
      }
    },
    {
      onSuccess: (data: ListBranchesOkResponse) => {
        setRepoData(prevState => ({
          ...prevState,
          branches: data
        }))
        setApiError(null)
      },
      onError: (error: ListBranchesErrorResponse) => {
        const message = error.message || 'Error fetching branches'
        setApiError({ type: ErrorTypes.FETCH_BRANCH, message })
      }
    }
  )

  const updateDescriptionMutation = useUpdateRepositoryMutation(
    { repo_ref: repoRef },
    {
      onMutate: async newData => {
        await queryClient.cancelQueries({ queryKey: ['findRepository', repoRef] })

        const previousRepoData = repoData

        // Optimistically update the description, mapping it to match repoData format
        setRepoData(prevState => ({
          ...prevState,
          description: newData.body.description || ''
        }))

        // Return the previous state for rollback if needed
        return { previousRepoData }
      },
      onError: (error: UpdateRepositoryErrorResponse, _data, context) => {
        setRepoData(context.previousRepoData)

        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating repository description'
        setApiError({ type: ErrorTypes.DESCRIPTION_UPDATE, message })
      },
      onSuccess: () => {
        setApiError(null)
      }
    }
  )

  const updateDefaultBranchMutation = useUpdateDefaultBranchMutation(
    { repo_ref: repoRef },
    {
      onMutate: async newData => {
        await queryClient.cancelQueries({ queryKey: ['listBranches', repoRef] })

        const previousRepoData = repoData

        // Optimistically update the default branch
        setRepoData(prevState => ({
          ...prevState,
          defaultBranch: newData.body.name || prevState.defaultBranch
        }))

        // Return the previous state for rollback if needed
        return { previousRepoData }
      },
      onError: (error: UpdateDefaultBranchErrorResponse, _data, context) => {
        setRepoData(context.previousRepoData)

        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['listBranches', repoRef] })

        const message = error.message || 'Error updating default branch'
        setApiError({ type: ErrorTypes.BRANCH_UPDATE, message })
      },
      onSuccess: () => {
        setApiError(null)
      }
    }
  )

  const updatePublicAccessMutation = useUpdatePublicAccessMutation(
    { repo_ref: repoRef },
    {
      onMutate: async newData => {
        await queryClient.cancelQueries({ queryKey: ['findRepository', repoRef] })

        const previousRepoData = repoData

        // Optimistically update the public access
        setRepoData(prevState => ({
          ...prevState,
          isPublic: newData.body.is_public !== undefined ? newData.body.is_public : prevState.isPublic
        }))

        // Return the previous state for rollback if needed
        return { previousRepoData }
      },
      onError: (error: UpdatePublicAccessErrorResponse, _data, context) => {
        setRepoData(context.previousRepoData)

        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating public access'
        setApiError({ type: ErrorTypes.UPDATE_ACCESS, message })
      },
      onSuccess: () => {
        setApiError(null)
      }
    }
  )

  const { isLoading: isLoadingSecuritySettings } = useFindSecuritySettingsQuery(
    { repo_ref: repoRef },
    {
      onSuccess: (data: FindSecuritySettingsOkResponse) => {
        setSecurityScanning(data.secret_scanning_enabled || false)
        setApiError(null)
      },
      onError: (error: FindSecuritySettingsErrorResponse) => {
        const message = error.message || 'Error fetching security settings'
        setApiError({ type: ErrorTypes.FETCH_SECURITY, message })
      }
    }
  )

  const updateSecuritySettingsMutation = useUpdateSecuritySettingsMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (data: UpdateSecuritySettingsOkResponse) => {
        setRepoData(prevState => ({
          ...prevState,
          securitySettings: data
        }))
        setApiError(null)
      },
      onError: (error: UpdateSecuritySettingsErrorResponse) => {
        const message = error.message || 'Error updating security settings'
        setApiError({ type: ErrorTypes.UPDATE_SECURITY, message })
      }
    }
  )

  const { mutate: deleteRepository, isLoading: isDeletingRepo } = useDeleteRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (_data: DeleteRepositoryOkResponse) => {
        navigate(`/sandbox/spaces/${spaceId}/repos`)
        setApiError(null)
      },
      onError: (error: DeleteRepositoryErrorResponse) => {
        const message = error.message || 'Error deleting repository'
        setApiError({ type: ErrorTypes.DELETE_REPO, message })
      }
    }
  )

  const handleDeleteRepository = () => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      deleteRepository({})
    }
  }

  const handleRepoUpdate = (data: RepoUpdateData) => {
    updateDescriptionMutation.mutate({
      body: {
        description: data.description
      }
    })
    updateDefaultBranchMutation.mutate({
      body: {
        name: data.branch
      }
    })
    updatePublicAccessMutation.mutate({
      body: {
        is_public: data.access === AccessLevel.PUBLIC
      }
    })
  }

  const handleUpdateSecuritySettings = (data: SecurityScanning) => {
    updateSecuritySettingsMutation.mutate({
      body: {
        secret_scanning_enabled: data.secretScanning
      }
    })
  }
  const loadingStates = {
    isLoadingRepoData: isLoadingBranches || isLoadingRepoData || isLoadingSecuritySettings,
    isUpdatingRepoData:
      updatePublicAccessMutation.isLoading ||
      updateDescriptionMutation.isLoading ||
      updateDefaultBranchMutation.isLoading,
    isLoadingSecuritySettings,
    isDeletingRepo: isDeletingRepo,
    isUpdatingSecuritySettings: updateSecuritySettingsMutation.isLoading
  }
  return (
    <RepoSettingsGeneralPage
      repoData={repoData}
      handleRepoUpdate={handleRepoUpdate}
      securityScanning={securityScanning}
      handleUpdateSecuritySettings={handleUpdateSecuritySettings}
      handleDeleteRepository={handleDeleteRepository}
      apiError={apiError}
      loadingStates={loadingStates}
      isRepoUpdateSuccess={
        updatePublicAccessMutation.isSuccess ||
        updateDescriptionMutation.isSuccess ||
        updateDefaultBranchMutation.isSuccess
      }
    />
  )
}
