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

const matchPathUtil = ({ path, end, isMFE }: { path: string; end: boolean; isMFE: boolean }, pathname: string) => {
  if (!isMFE) {
    return matchPath({ path, end }, pathname)
  }

  const pathToMatch = path.replace('/:spaceId', '')

  const isMatch = matchPath({ path: pathToMatch, end }, pathname)

  return isMatch
}

export function getBreadcrumbMatchers(pathname: string, isMFE: boolean) {
  const isProjectsRoute = !!matchPathUtil(
    {
      path: '',
      end: false,
      isMFE
    },
    pathname
  )

  const isExcludedProjectRoute = ['/create'].find(route => {
    return matchPathUtil(
      {
        path: route,
        end: false,
        isMFE
      },
      pathname
    )
  })

  const isProjectRoute =
    !!matchPathUtil(
      {
        path: '/:spaceId',
        end: false,
        isMFE
      },
      pathname
    ) && !isExcludedProjectRoute

  const isExcludedRepoRoute = ['/:spaceId/repos/create'].find(route => {
    return matchPathUtil(
      {
        path: route,
        end: true,
        isMFE
      },
      pathname
    )
  })

  const isRepoRoute =
    !!matchPathUtil(
      {
        path: '/:spaceId/repos/:repoId',
        end: false,
        isMFE
      },
      pathname
    ) && !isExcludedRepoRoute

  let repoPageMatch = repoRoutePathNameMap.find(repoRoutePathNameItem => {
    return matchPathUtil(
      {
        path: `/:spaceId/repos/:repoId${repoRoutePathNameItem.path}`,
        end: false,
        isMFE
      },
      pathname
    )
  })

  // default repo page
  if (!repoPageMatch && isRepoRoute) {
    repoPageMatch = { path: '/summary', label: 'Summary' }
  }

  const isRepoPageRoute = !!repoPageMatch

  const isExcludedPipelineRoute = ['/:spaceId/repos/:repoId/pipelines/create'].find(route => {
    return matchPathUtil(
      {
        path: route,
        end: false,
        isMFE
      },
      pathname
    )
  })

  const isPipelineRoute =
    !!matchPathUtil(
      {
        path: '/:spaceId/repos/:repoId/pipelines/:pipelineId',
        end: false,
        isMFE
      },
      pathname
    ) && !isExcludedPipelineRoute

  const isPipelineEditRouteExact = !!matchPathUtil(
    {
      path: '/:spaceId/repos/:repoId/pipelines/:pipelineId/edit',
      end: true,
      isMFE
    },
    pathname
  )
  const isPipelineExecutionsRouteExact =
    !!matchPathUtil(
      {
        path: '/:spaceId/repos/:repoId/pipelines/:pipelineId',
        end: true,
        isMFE
      },
      pathname
    ) && !isExcludedPipelineRoute

  const isExecutionRoute = !!matchPathUtil(
    {
      path: '/:spaceId/repos/:repoId/pipelines/:pipelineId/executions/:executionId',
      end: false,
      isMFE
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
