import { useNavigate, useParams } from 'react-router-dom'

import { useForkCreateMutation } from '@harnessio/code-service-client'
import { ForkType, RepoForkFormFields, RepoForkView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { DestinationSelector } from '../../components-v2/destination-selector'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useGitRef } from '../../hooks/useGitRef'
import { PathParams } from '../../RouteDefinitions'

export default function RepoForkPage() {
  const { repoData } = useGitRef()
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const isMFE = useIsMFE()
  const { routeUtils } = useMFEContext()
  const { spaceId, repoId } = useParams<PathParams>()

  const {
    mutate: forkRepo,
    isLoading: isForking,
    error: forkError
  } = useForkCreateMutation(
    { repo_ref: repoRef },
    {
      onSuccess: response => {
        const forkedRepo = response.body
        if (isMFE) {
          routeUtils?.toCODERepository?.({ repoPath: forkedRepo?.path || '' })
        } else {
          const destinationSpaceId = `${forkedRepo?.path?.split('/')[1]}/${forkedRepo?.path?.split('/')[2]}`
          navigate(
            routes.toRepoSummary({
              spaceId: destinationSpaceId,
              repoId: forkedRepo?.identifier || repoId
            })
          )
        }
      }
    }
  )

  const handleForkSubmit = (data: RepoForkFormFields) => {
    forkRepo({
      body: {
        identifier: data.name,
        parent_ref: data.forkDestination,
        is_public: !data.makePrivate,
        ...(data.forkType === ForkType.Branch && { fork_branch: data.branchToFork })
      }
    })
  }

  const onCancel = () => {
    navigate(routes.toRepoSummary({ spaceId, repoId }))
  }

  return (
    <RepoForkView
      onFormSubmit={handleForkSubmit}
      onFormCancel={onCancel}
      isLoading={isForking}
      branchSelectorRenderer={(onBranchSelect, currentBranchName) => (
        <BranchSelectorContainer
          onSelectBranchorTag={branchTagName => {
            onBranchSelect(branchTagName.name)
          }}
          selectedBranch={{ name: currentBranchName || '', sha: '' }}
          autoSelectDefaultBranch={false}
          isBranchOnly
          dynamicWidth
          selectorTitle="Select branch"
        />
      )}
      destinationSelectorRenderer={(onDestinationSelect: (destination: string) => void) => (
        <DestinationSelector
          title="Destination"
          triggerLabel="Select destination"
          onDestinationChange={(scope, _type) => {
            if (scope) {
              onDestinationSelect(scope.value)
            }
          }}
        />
      )}
      apiError={forkError?.message}
      repoIdentifier={repoData?.identifier || repoId}
      isPublic={!!repoData?.is_public}
      defaultBranchName={repoData?.default_branch}
    />
  )
}
