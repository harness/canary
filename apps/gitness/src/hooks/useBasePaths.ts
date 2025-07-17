import { useParams } from 'react-router-dom'

import { useRoutes } from '../framework/context/NavigationContext'
import { PathParams } from '../RouteDefinitions'

// TODO: Remove this hook
// This hook should not be needed once we are able to achieve gitRef persistence
// using uncontrolled Tabs rather than using controlled Tabs approach
export function useBasePaths() {
  const { spaceId, repoId } = useParams<PathParams>()
  const routes = useRoutes()

  return {
    baseSummaryPath: routes.toRepoSummary({ spaceId, repoId }),
    baseFilesPath: routes.toRepoFiles({ spaceId, repoId }),
    baseCommitsPath: routes.toRepoCommits({ spaceId, repoId }),
    basePipelinesPath: routes.toRepoPipelines({ spaceId, repoId }),
    baseTagsPath: routes.toRepoTags({ spaceId, repoId }),
    basePullsPath: routes.toPullRequests({ spaceId, repoId }),
    baseBranchesPath: routes.toRepoBranches({ spaceId, repoId }),
    baseSettingsPath: routes.toRepoGeneralSettings({ spaceId, repoId })
  }
}
