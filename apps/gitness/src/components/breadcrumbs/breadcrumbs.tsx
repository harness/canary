import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@harnessio/canary'
import { useListExecutionsQuery, useListPipelinesQuery, useListReposQuery } from '@harnessio/code-service-client'
import { Topbar } from '@harnessio/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PageResponseHeader } from '../../types'
import { BreadcrumbDropdown, BreadcrumbDropdownProps } from './breadcrumb-dropdown'
import { getBreadcrumbMatchers } from './breadcrumbs-utils'

const MAX_DROPDOWN_ITEMS = 10

export default function Breadcrumbs() {
  const { pathname } = useLocation()
  const space = useGetSpaceURLParam()
  const repoRef = useGetRepoRef()
  const { pipelineId, repoId, executionId: executionIdParam } = useParams()
  const executionId = executionIdParam ? parseInt(executionIdParam) : undefined

  const { spaces: spacesAll } = useAppContext()
  const spaces = useMemo(() => [...spacesAll].splice(0, 10), [spacesAll])
  // TODO: hasMoreSpaces

  const { data: { body: repos, headers: reposHeaders } = {} } = useListReposQuery({
    queryParams: { limit: MAX_DROPDOWN_ITEMS },
    space_ref: `${space}/+`
  })
  const hasMoreRepos = parseInt(reposHeaders?.get(PageResponseHeader.xTotalPages) || '') > 1

  const { data: { body: pipelines, headers: pipelinesHeaders } = {} } = useListPipelinesQuery(
    {
      repo_ref: repoRef,
      queryParams: { limit: MAX_DROPDOWN_ITEMS }
    },
    { enabled: !!repoRef }
  )
  const hasMorePipelines = parseInt(pipelinesHeaders?.get(PageResponseHeader.xTotalPages) || '') > 1

  const { data: { body: executions, headers: executionsHeaders } = {} } = useListExecutionsQuery(
    {
      repo_ref: repoRef,
      pipeline_identifier: pipelineId || '',
      queryParams: { limit: MAX_DROPDOWN_ITEMS }
    },
    { enabled: !!repoRef }
  )
  const hasMoreExecutions = parseInt(executionsHeaders?.get(PageResponseHeader.xTotalPages) || '') > 1

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
        path: `/spaces/${spaceItem.path}/repos`,
        value: spaceItem.path as string
      }))

      items.push({
        label: 'Create Project',
        key: '/spaces/create',
        path: '/spaces/create',
        value: ''
      })
      return { items, selectedValue: space, placeholder: 'Select project' }
    }
  }, [spaces, space, isProjectRoute])

  const reposBreadcrumbProps = useMemo((): BreadcrumbDropdownProps | undefined => {
    let items: BreadcrumbDropdownProps['items'] | undefined = []

    if (isRepoRoute) {
      items = repos?.map(repo => ({
        key: repo.identifier as string,
        label: repo.identifier as string,
        path: `/spaces/${space}/repos/${repo.identifier}`,
        value: repo.identifier as string
      }))

      if (hasMoreRepos) {
        items?.push({
          label: 'View all',
          key: `/spaces/${space}/repos`,
          path: `/spaces/${space}/repos`,
          value: ''
        })
      }

      // TODO: repoId may not exist
      const selectedItem = {
        key: repoId as string,
        label: repoId as string,
        path: `/spaces/${space}/repos/${repoId}}}`,
        value: repoId as string
      }

      return { items: items ?? [], selectedItem, placeholder: 'Select repository' }
    }
  }, [repos, repoId, isRepoRoute, space])

  const pipelinesBreadcrumbProps = useMemo((): BreadcrumbDropdownProps | undefined => {
    if (isPipelineRoute && pipelines) {
      const items = pipelines.map(pipeline => ({
        key: pipeline.identifier as string,
        label: pipeline.identifier as string,
        path: `/spaces/${space}/repos/${repoId}/pipelines/${pipeline.identifier}`,
        value: pipeline.identifier as string
      }))

      if (hasMorePipelines) {
        items.push({
          label: 'View all',
          key: `/spaces/${space}/repos/${repoId}/pipelines`,
          path: `/spaces/${space}/repos/${repoId}/pipelines`,
          value: ''
        })
      }

      // TODO: pipelineId may not exist
      const selectedItem = {
        key: pipelineId as string,
        label: pipelineId as string,
        path: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}}`,
        value: pipelineId as string
      }

      return { items, selectedItem, placeholder: 'Select pipeline' }
    }
  }, [pipelines, pipelineId, isPipelineRoute, space, repoId])

  const executionsBreadcrumbProps = useMemo((): BreadcrumbDropdownProps | undefined => {
    if (isExecutionRoute && executions) {
      const items = executions.map(execution => ({
        key: `${execution.number}`,
        label: `${execution.number}`,
        path: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}/executions/${execution.number}`,
        value: execution.number as number
      }))

      if (hasMoreExecutions) {
        items.push({
          label: 'View all',
          key: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`,
          path: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`,
          value: -1
        })
      }

      // TODO: executionId may not exist
      const selectedItem = {
        key: `${executionId}`,
        label: `${executionId}`,
        path: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}/executions/${executionId}`,
        value: executionId as number
      }

      return { items, selectedItem, placeholder: 'Select execution' }
    }
  }, [pipelineId, isExecutionRoute, space, repoId, executionId, executions, hasMoreExecutions])

  const pipelinePageSwitchBreadcrumbProps = useMemo((): BreadcrumbDropdownProps | undefined => {
    if (isPipelineExecutionsRouteExact || isPipelineEditRouteExact) {
      const items = [
        {
          label: 'Executions',
          key: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`,
          path: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`,
          value: 'executions'
        },
        {
          label: 'Edit',
          key: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}/edit`,
          path: `/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}/edit`,
          value: 'edit'
        }
      ]

      return {
        items,
        selectedValue: isPipelineExecutionsRouteExact ? 'executions' : 'edit',
        placeholder: 'Select execution'
      }
    }
  }, [pipelines, pipelineId, isExecutionRoute, space, repoId, isPipelineExecutionsRouteExact, isPipelineEditRouteExact])

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb className="select-none">
          <BreadcrumbList>
            {/* Projects dropdown*/}
            {spacesBreadcrumbProps ? <BreadcrumbDropdown {...spacesBreadcrumbProps} /> : null}

            {/* Repositories link*/}
            {isProjectRoute && spaces ? (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/spaces/${space}/repos`}>Repositories</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}

            {/* Repositories dropdown*/}
            {reposBreadcrumbProps ? (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbDropdown {...reposBreadcrumbProps} />
              </>
            ) : null}

            {/* Repo page link */}
            {isRepoPageRoute && repoPageMatch ? (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/spaces/${space}/repos/${repoId}${repoPageMatch.path}`}>{repoPageMatch.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}

            {/* Pipelines dropdown*/}
            {pipelinesBreadcrumbProps ? (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                {pipelinesBreadcrumbProps ? <BreadcrumbDropdown {...pipelinesBreadcrumbProps} /> : null}
              </>
            ) : null}

            {/* Executions link*/}
            {isExecutionRoute ? (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/spaces/${space}/repos/${repoId}/pipelines/${pipelineId}`}>Executions</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}

            {/* Edit/Executions dropdown */}
            {pipelinePageSwitchBreadcrumbProps ? (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbDropdown {...pipelinePageSwitchBreadcrumbProps} />
              </>
            ) : null}

            {/* Executions dropdown */}
            {executionsBreadcrumbProps ? (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbDropdown {...executionsBreadcrumbProps} />
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar.Left>
    </Topbar.Root>
  )
}
