import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import {
  Avatar,
  AvatarFallback,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@harnessio/canary'
import { getInitials, Topbar } from '@harnessio/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { BreadcrumbDropdown, BreadcrumbDropdownProps } from './breadcrumb-dropdown'
import { getBreadcrumbMatchers, ROUTE_BASE_PATH } from './breadcrumbs-utils'

export default function Breadcrumbs() {
  const { pathname } = useLocation()
  const space = useGetSpaceURLParam()
  const { pipelineId, repoId, executionId: executionIdParam } = useParams()
  const executionId = executionIdParam ? parseInt(executionIdParam) : undefined

  const { spaces: spacesAll } = useAppContext()

  // TODO: hasMoreSpaces
  const spaces = useMemo(() => [...spacesAll].splice(0, 10), [spacesAll])

  const {
    isProjectRoute,
    isRepoRoute,
    isRepoPageRoute,
    isPipelineRoute,
    isPipelineEditRouteExact,
    isPipelineExecutionsRouteExact,
    isExecutionRoute,
    repoPageMatch
  } = getBreadcrumbMatchers(pathname)

  const spacesBreadcrumbProps = useMemo((): BreadcrumbDropdownProps | undefined => {
    if (isProjectRoute && spaces) {
      const items = spaces.map(spaceItem => ({
        key: spaceItem.path as string,
        label: spaceItem.path as string,
        path: ROUTE_BASE_PATH + `/spaces/${spaceItem.path}/repos`,
        value: spaceItem.path as string
      }))

      items.push({
        label: 'Create Project',
        key: ROUTE_BASE_PATH + '/spaces/create',
        path: ROUTE_BASE_PATH + '/spaces/create',
        value: ''
      })

      const icon = (
        <Avatar className="size-7">
          <AvatarFallback>{getInitials(space ?? '', 1)}</AvatarFallback>
        </Avatar>
      )
      return { items, selectedValue: space, placeholder: 'Select project', icon }
    }
  }, [spaces, space, isProjectRoute])

  const getBreadcrumbSegment = ({ label, path, isLast }: { label?: string; path: string; isLast: boolean }) => {
    return (
      <>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          {!isLast ? (
            <BreadcrumbLink asChild>
              <Link to={path}>{label}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </>
    )
  }
  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb className="select-none">
          <BreadcrumbList>
            {spacesBreadcrumbProps ? <BreadcrumbDropdown {...spacesBreadcrumbProps} /> : null}

            {isProjectRoute && spaces ? (
              <>
                {getBreadcrumbSegment({
                  label: 'Repositories',
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos`,
                  isLast: !isRepoRoute
                })}
              </>
            ) : null}

            {isRepoRoute ? (
              <>
                {getBreadcrumbSegment({
                  label: repoId,
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos/${repoId}`,
                  isLast: !(isRepoPageRoute && repoPageMatch)
                })}
              </>
            ) : null}

            {isRepoPageRoute && repoPageMatch ? (
              <>
                {getBreadcrumbSegment({
                  label: repoPageMatch.label,
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos/${repoId}${repoPageMatch.path}`,
                  isLast: !isPipelineRoute
                })}
              </>
            ) : null}

            {isPipelineRoute ? (
              <>
                {getBreadcrumbSegment({
                  label: pipelineId,
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`,
                  isLast: !isExecutionRoute && !isPipelineExecutionsRouteExact && !isPipelineEditRouteExact
                })}
              </>
            ) : null}

            {isExecutionRoute ? (
              <>
                {getBreadcrumbSegment({
                  label: 'Executions',
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`,
                  isLast: !isExecutionRoute
                })}
              </>
            ) : null}

            {isPipelineExecutionsRouteExact ? (
              <>
                {getBreadcrumbSegment({
                  label: 'Executions',
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`,
                  isLast: !isExecutionRoute
                })}
              </>
            ) : null}

            {isPipelineEditRouteExact ? (
              <>
                {getBreadcrumbSegment({
                  label: 'Edit',
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}/edit`,
                  isLast: !isExecutionRoute
                })}
              </>
            ) : null}

            {isExecutionRoute ? (
              <>
                {getBreadcrumbSegment({
                  label: `${executionId}`,
                  path: `${ROUTE_BASE_PATH}/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}/executions/${executionId}`,
                  isLast: true
                })}
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar.Left>
    </Topbar.Root>
  )
}
