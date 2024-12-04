import { matchPath } from 'react-router-dom'

const repoRoutePathNameMap = [
  { path: '/summary', label: 'Summary' },
  { path: '/code', label: 'Files' },
  { path: '/pipelines', label: 'Pipelines' },
  { path: '/commits', label: 'Commits' },
  { path: '/pull-requests', label: 'Pull requests' },
  { path: '/webhooks', label: 'Webhooks' },
  { path: '/branches', label: 'Branches' },
  { path: '/settings/general', label: 'Settings' }
]

export function getBreadcrumbMatchers(pathname: string) {
  const isProjectsRoute = !!matchPath(
    {
      path: '/spaces',
      end: false
    },
    pathname
  )

  const isExcludedProjectRoute = ['/spaces/create'].find(route => {
    return matchPath(
      {
        path: route,
        end: false
      },
      pathname
    )
  })

  const isProjectRoute =
    !!matchPath(
      {
        path: '/spaces/:spaceId',
        end: false
      },
      pathname
    ) && !isExcludedProjectRoute

  const isExcludedRepoRoute = ['/spaces/:spaceId/repos/create'].find(route => {
    return matchPath(
      {
        path: route,
        end: true
      },
      pathname
    )
  })

  const isRepoRoute =
    !!matchPath(
      {
        path: '/spaces/:spaceId/repos/:repoId',
        end: false
      },
      pathname
    ) && !isExcludedRepoRoute

  let repoPageMatch = repoRoutePathNameMap.find(repoRoutePathNameItem => {
    return matchPath(
      {
        path: `/spaces/:spaceId/repos/:repoId${repoRoutePathNameItem.path}`,
        end: false
      },
      pathname
    )
  })

  // default repo page
  if (!repoPageMatch && isRepoRoute) {
    repoPageMatch = { path: '/summary', label: 'Summary' }
  }

  const isRepoPageRoute = !!repoPageMatch

  const isExcludedPipelineRoute = ['/spaces/:spaceId/repos/:repoId/pipelines/create'].find(route => {
    return matchPath(
      {
        path: route,
        end: false
      },
      pathname
    )
  })

  const isPipelineRoute =
    !!matchPath(
      {
        path: '/spaces/:spaceId/repos/:repoId/pipelines/:pipelineId',
        end: false
      },
      pathname
    ) && !isExcludedPipelineRoute

  const isPipelineEditRouteExact = !!matchPath(
    {
      path: '/spaces/:spaceId/repos/:repoId/pipelines/:pipelineId/edit',
      end: true
    },
    pathname
  )
  const isPipelineExecutionsRouteExact =
    !!matchPath(
      {
        path: '/spaces/:spaceId/repos/:repoId/pipelines/:pipelineId',
        end: true
      },
      pathname
    ) && !isExcludedPipelineRoute

  const isExecutionRoute = !!matchPath(
    {
      path: '/spaces/:spaceId/repos/:repoId/pipelines/:pipelineId/executions/:executionId',
      end: false
    },
    pathname
  )

  return {
    isProjectsRoute,
    isProjectRoute,
    isRepoRoute,
    isRepoPageRoute,
    isPipelineRoute,
    isPipelineEditRouteExact,
    isPipelineExecutionsRouteExact,
    isExecutionRoute,
    repoPageMatch
  }
}
