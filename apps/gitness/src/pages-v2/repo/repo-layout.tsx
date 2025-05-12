import { Outlet } from 'react-router-dom'

import { useFindRepositoryQuery } from '@harnessio/code-service-client'
import { RepoHeader, RepoSubheader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const repoRef = useGetRepoRef()

  const { data: { body: repoData } = {}, isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef }
    // {
    //   onError: (error: FindRepositoryErrorResponse) => {
    //     const message = error.message || 'Error fetching repo'
    //     setApiError({ type: ErrorTypes.FETCH_REPO, message })
    //   }
    // }
  )
  console.log('🚀 ~ RepoLayout ~ repoData:', repoData)

  return (
    <>
      <RepoHeader
        name={repoData?.identifier ?? ''}
        isPublic={!!repoData?.is_public}
        useTranslationStore={useTranslationStore}
      />
      <SubHeaderWrapper>
        <RepoSubheader showPipelinesTab={!isMFE} useTranslationStore={useTranslationStore} />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
