import { RepoSettingsGeneralPage } from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import {
  useFindRepositoryQuery,
  FindRepositoryOkResponse,
  FindRepositoryErrorResponse,
  useListBranchesQuery,
  ListBranchesOkResponse,
  ListBranchesErrorResponse,
  RepoBranch
} from '@harnessio/code-service-client'
import { useState } from 'react'

export const RepoSettingsGeneralPageContainer = () => {
  const repoRef = useGetRepoRef()
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

  const [branches, setBranches] = useState<Omit<ListBranchesOkResponse, 'commit'>[]>([])
  // Use the useFindRepositoryQuery hook with onSuccess and onError callbacks
  const { isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onSuccess: (data: FindRepositoryOkResponse) => {
        console.log('Data fetched successfully:', data)
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
        limit: 30
      }
    },
    {
      onSuccess: (data: ListBranchesOkResponse) => {
        console.log('Branches fetched successfully:', data)
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

  // Render the RepoSettingsGeneralPage with the fetched data
  return <RepoSettingsGeneralPage repoData={repoData} />
}
