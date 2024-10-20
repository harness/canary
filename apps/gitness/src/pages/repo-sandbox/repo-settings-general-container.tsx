import { RepoSettingsGeneralPage } from '@harnessio/playground'
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
  useUpdateSecuritySettingsMutation,
  useDeleteRepositoryMutation
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
  const [securityScanning, setSecurityScanning] = useState<boolean | null>(null)

  const { isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onSuccess: (data: FindRepositoryOkResponse) => {
        // console.log('Data fetched successfully:', data)
        setRepoData({
          name: data.identifier || '',
          description: data.description || '',
          defaultBranch: data.default_branch || '',
          isPublic: data.is_public ?? false,
          branches: []
        })
        // Perform additional actions with the data if needed
      },
      onError: (error: FindRepositoryErrorResponse) => {
        console.error('Error fetching data:', error.message)
        // Handle the error, e.g., show a notification to the user
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
        // console.log('Branches fetched successfully:', data)
        setRepoData(prevState => ({
          ...prevState,
          branches: data
        }))
      },
      onError: (error: ListBranchesErrorResponse) => {
        console.error('Error fetching branches:', error.message)
      }
    }
  )

  const updateDescriptionMutation = useUpdateRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (data: UpdateRepositoryOkResponse) => {
        console.log('Repository updated successfully:', data)
        setRepoData(prevState => ({
          ...prevState,
          description: data.description!
        }))
      },
      onError: (error: UpdateRepositoryErrorResponse) => {
        console.error('Error updating repository:', error.message)
      }
    }
  )

  const updateDefaultBranchMutation = useUpdateDefaultBranchMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (data: UpdateDefaultBranchOkResponse) => {
        console.log('Default branch updated successfully:', data)
        setRepoData(prevState => ({
          ...prevState,
          defaultBranch: data.default_branch!
        }))
      },
      onError: (error: UpdateDefaultBranchErrorResponse) => {
        console.error('Error updating default branch:', error.message)
      }
    }
  )
  const updatePublicAccessMutation = useUpdatePublicAccessMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (data: UpdatePublicAccessOkResponse) => {
        console.log('Public access updated successfully:', data)
        setRepoData(prevState => ({
          ...prevState,
          isPublic: data.is_public!
        }))
      },
      onError: (error: UpdatePublicAccessErrorResponse) => {
        console.error('Error updating public access:', error.message)
      }
    }
  )

  const { isLoading: isLoadingSecuritySettings } = useFindSecuritySettingsQuery(
    { repo_ref: repoRef },
    {
      onSuccess: data => {
        console.log('Security settings fetched successfully:', data)
        setSecurityScanning(data.secret_scanning_enabled || null)
      },
      onError: error => {
        console.error('Error fetching security settings:', error.message)
      }
    }
  )

  const updateSecuritySettingsMutation = useUpdateSecuritySettingsMutation(
    { repo_ref: repoRef },
    {
      onSuccess: data => {
        setRepoData(prevState => ({
          ...prevState,
          securitySettings: data
        }))
      },
      onError: error => {
        console.error('Error updating security settings:', error.message)
      }
    }
  )

  const deleteRepositoryMutation = useDeleteRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        navigate(`/sandbox/spaces/${spaceId}/repos`)
      },
      onError: error => {
        console.error('Error deleting repository:', error.message)
      }
    }
  )

  const handleDeleteRepository = () => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      deleteRepositoryMutation.mutate({})
    }
  }

  const handleRepoUpdate = data => {
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
        is_public: data.access === '1'
      }
    })
  }

  const handleUpdateSecuritySettings = newSettings => {
    updateSecuritySettingsMutation.mutate({
      body: {
        secret_scanning_enabled: newSettings.secretScanning
      }
    })
  }

  if (isLoadingRepoData || isLoadingBranches || isLoadingSecuritySettings) {
    return <div>Loading...</div>
  }

  // Render the RepoSettingsGeneralPage with the fetched data
  console.log(securityScanning)
  return (
    <RepoSettingsGeneralPage
      repoData={repoData}
      handleRepoUpdate={handleRepoUpdate}
      securityScanning={securityScanning}
      handleUpdateSecuritySettings={handleUpdateSecuritySettings}
      handleDeleteRepository={handleDeleteRepository}
    />
  )
}
