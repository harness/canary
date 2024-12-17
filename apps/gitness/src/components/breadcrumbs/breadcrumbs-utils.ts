import { useContext } from 'react'
import { matchPath } from 'react-router-dom'

import { MFEContext } from '../../framework/context/MFEContext'

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

const matchPathUtil = ({ path, end }: { path: string; end: boolean }, pathname: string) => {
  const { renderUrl } = useContext(MFEContext)

  if (!renderUrl) {
    return matchPath({ path, end }, pathname)
  }

  const pathToMatch = path.replace('/:spaceId', '')

  const isMatch = matchPath({ path: pathToMatch, end }, pathname)

  // if (isMatch) {
  //   console.log('renderUrl', renderUrl)
  //   console.log('path', pathToMatch)
  // }

  return isMatch
}

export function getBreadcrumbMatchers(pathname: string) {
  const isProjectsRoute = !!matchPathUtil(
    {
      path: '',
      end: false
    },
    pathname
  )

  const isExcludedProjectRoute = ['/create'].find(route => {
    return matchPathUtil(
      {
        path: route,
        end: false
      },
      pathname
    )
  })

  const isProjectRoute =
    !!matchPathUtil(
      {
        path: '/:spaceId',
        end: false
      },
      pathname
    ) && !isExcludedProjectRoute

  const isExcludedRepoRoute = ['/:spaceId/repos/create'].find(route => {
    return matchPathUtil(
      {
        path: route,
        end: true
      },
      pathname
    )
  })

  const isRepoRoute =
    !!matchPathUtil(
      {
        path: '/:spaceId/repos/:repoId',
        end: false
      },
      pathname
    ) && !isExcludedRepoRoute

  let repoPageMatch = repoRoutePathNameMap.find(repoRoutePathNameItem => {
    return matchPathUtil(
      {
        path: `/:spaceId/repos/:repoId${repoRoutePathNameItem.path}`,
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

  const isExcludedPipelineRoute = ['/:spaceId/repos/:repoId/pipelines/create'].find(route => {
    return matchPathUtil(
      {
        path: route,
        end: false
      },
      pathname
    )
  })

  const isPipelineRoute =
    !!matchPathUtil(
      {
        path: '/:spaceId/repos/:repoId/pipelines/:pipelineId',
        end: false
      },
      pathname
    ) && !isExcludedPipelineRoute

  const isPipelineEditRouteExact = !!matchPathUtil(
    {
      path: '/:spaceId/repos/:repoId/pipelines/:pipelineId/edit',
      end: true
    },
    pathname
  )
  const isPipelineExecutionsRouteExact =
    !!matchPathUtil(
      {
        path: '/:spaceId/repos/:repoId/pipelines/:pipelineId',
        end: true
      },
      pathname
    ) && !isExcludedPipelineRoute

  const isExecutionRoute = !!matchPathUtil(
    {
      path: '/:spaceId/repos/:repoId/pipelines/:pipelineId/executions/:executionId',
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
