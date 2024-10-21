import {
  RepoSettingsGeneralPage,
  RepoUpdateData,
  SecurityScanning,
  AccessLevel,
  ErrorTypes
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
  RepoBranch,
  useUpdateRepositoryMutation,
  UpdateRepositoryOkResponse,
  UpdateRepositoryErrorResponse,
  useUpdateDefaultBranchMutation,
  UpdateDefaultBranchOkResponse,
  UpdateDefaultBranchErrorResponse,
  useUpdatePublicAccessMutation,
  UpdatePublicAccessOkResponse,
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
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const RepoSettingsGeneralPageContainer = () => {
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const spaceId = useGetSpaceURLParam()

  const [repoData, setRepoData] = useState<{
    name: string
    description: string
    defaultBranch: string
    isPublic: boolean
    branches: Omit<RepoBranch, 'commit'>[]
  }>({
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
      onSuccess: (data: UpdateRepositoryOkResponse) => {
        setRepoData(prevState => ({
          ...prevState,
          description: data.description!
        }))
        setApiError(null)
      },
      onError: (error: UpdateRepositoryErrorResponse) => {
        const message = error.message || 'Error updating repository description'
        setApiError({ type: ErrorTypes.DESCRIPTION_UPDATE, message })
      }
    }
  )

  const updateDefaultBranchMutation = useUpdateDefaultBranchMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (data: UpdateDefaultBranchOkResponse) => {
        setRepoData(prevState => ({
          ...prevState,
          defaultBranch: data.default_branch!
        }))
        setApiError(null)
      },
      onError: (error: UpdateDefaultBranchErrorResponse) => {
        const message = error.message || 'Error updating default branch'
        setApiError({ type: ErrorTypes.BRANCH_UPDATE, message })
      }
    }
  )
  const updatePublicAccessMutation = useUpdatePublicAccessMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (data: UpdatePublicAccessOkResponse) => {
        setRepoData(prevState => ({
          ...prevState,
          isPublic: data.is_public!
        }))
        setApiError(null)
      },
      onError: (error: UpdatePublicAccessErrorResponse) => {
        const message = error.message || 'Error updating public access'
        setApiError({ type: ErrorTypes.UPDATE_ACCESS, message })
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

  const deleteRepositoryMutation = useDeleteRepositoryMutation(
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
      deleteRepositoryMutation.mutate({})
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
    isDeletingRepo: deleteRepositoryMutation.isLoading,
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
