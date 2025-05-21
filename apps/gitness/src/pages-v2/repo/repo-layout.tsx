import { Outlet } from 'react-router-dom'

import { useFindRepositoryQuery } from '@harnessio/code-service-client'
import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const repoRef = useGetRepoRef()

  const { data: { body: repoData } = {}, isLoading: isLoadingRepoData } = useFindRepositoryQuery({ repo_ref: repoRef })

  return (
    <>
      <RepoHeader name={repoData?.identifier ?? ''} isPublic={!!repoData?.is_public} isLoading={isLoadingRepoData} />
      <SubHeaderWrapper>
        <RepoSubheader showPipelinesTab={!isMFE} />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
