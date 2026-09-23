import { act } from 'react-dom/test-utils'

import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useChangeTargetBranchMutation, useGetPullReqQuery, useUpdatePullReqMutation } from '@harnessio/code-service-client'

import PullRequestLayout from '../pull-request-layout'
import { usePullRequestStore } from '../stores/pull-request-store'

vi.mock('react-router-dom', () => ({
  useParams: () => mockParams
}))

vi.mock('@harnessio/code-service-client', () => ({
  useGetPullReqQuery: vi.fn(),
  useUpdatePullReqMutation: vi.fn(() => ({ mutateAsync: vi.fn() })),
  useChangeTargetBranchMutation: vi.fn(() => ({ mutateAsync: vi.fn() }))
}))

vi.mock('@harnessio/views', () => ({
  PullRequestLayout: () => null
}))

vi.mock('../../../components-v2/branch-selector-container', () => ({
  BranchSelectorContainer: () => null
}))

vi.mock('../../../framework/context/PageTitleContext', () => ({
  usePageTitleContext: () => ({ setPageTitle: vi.fn() })
}))

vi.mock('../../../framework/hooks/useGetRepoPath', () => ({
  useGetRepoRef: () => 'space/repo/+'
}))

vi.mock('../../../hooks/useGetPullRequestTab', () => ({
  default: () => 'conversation'
}))

vi.mock('../../../hooks/useUpstreamRepoUrl', () => ({
  useUpstreamRepoUrl: () => () => ''
}))

let mockParams: { pullRequestId?: string; spaceId?: string; repoId?: string } = {
  pullRequestId: '6',
  spaceId: 'space',
  repoId: 'repo'
}

const mockedUseGetPullReqQuery = vi.mocked(useGetPullReqQuery)

const buildQueryResult = (overrides: Partial<ReturnType<typeof useGetPullReqQuery>> = {}) =>
  ({
    data: undefined,
    error: null,
    isFetching: false,
    refetch: vi.fn(),
    ...overrides
  }) as unknown as ReturnType<typeof useGetPullReqQuery>

describe('PullRequestLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePullRequestStore.setState({
      pullRequest: null,
      pullReqError: null,
      pullReqLoading: false,
      refetchPullReq: () => {}
    })
    mockParams = { pullRequestId: '6', spaceId: 'space', repoId: 'repo' }
    vi.mocked(useUpdatePullReqMutation).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useUpdatePullReqMutation
    >)
    vi.mocked(useChangeTargetBranchMutation).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useChangeTargetBranchMutation
    >)
  })

  it('publishes PR to store', async () => {
    const prData = { number: 6, title: 'My PR' }
    mockedUseGetPullReqQuery.mockReturnValue(buildQueryResult({ data: { body: prData } } as never))

    await act(async () => {
      render(<PullRequestLayout />)
    })

    expect(usePullRequestStore.getState().pullRequest).toEqual(prData)
  })

  it('publishes error when query fails', async () => {
    const error = { message: 'boom' }
    mockedUseGetPullReqQuery.mockReturnValue(buildQueryResult({ error } as never))

    await act(async () => {
      render(<PullRequestLayout />)
    })

    expect(usePullRequestStore.getState().pullReqError).toEqual(error)
  })

  it('publishes in-flight state', async () => {
    mockedUseGetPullReqQuery.mockReturnValue(buildQueryResult({ isFetching: true } as never))

    await act(async () => {
      render(<PullRequestLayout />)
    })

    expect(usePullRequestStore.getState().pullReqLoading).toBe(true)
    expect(usePullRequestStore.getState().pullRequest).toBeNull()
  })

  it('drops leftover state when route PR number mismatches', async () => {
    usePullRequestStore.setState({
      pullRequest: { number: 5, title: 'Stale PR' },
      pullReqError: null,
      pullReqLoading: false,
      refetchPullReq: () => {}
    })
    mockParams = { pullRequestId: '6', spaceId: 'space', repoId: 'repo' }
    mockedUseGetPullReqQuery.mockReturnValue(buildQueryResult({ isFetching: true } as never))

    await act(async () => {
      render(<PullRequestLayout />)
    })

    expect(usePullRequestStore.getState().pullRequest).toBeNull()
  })

  it('does not publish a PR whose number is not the route ID', async () => {
    const mismatchedPr = { number: 999, title: 'Wrong PR' }
    mockedUseGetPullReqQuery.mockReturnValue(buildQueryResult({ data: { body: mismatchedPr } } as never))

    await act(async () => {
      render(<PullRequestLayout />)
    })

    expect(usePullRequestStore.getState().pullRequest).not.toEqual(mismatchedPr)
  })

  it('keeps header when remounting the same PR', async () => {
    const prData = { number: 6, title: 'My PR' }
    mockedUseGetPullReqQuery.mockReturnValue(buildQueryResult({ data: { body: prData } } as never))

    const { unmount } = render(<PullRequestLayout />)
    await act(async () => {})

    expect(usePullRequestStore.getState().pullRequest).toEqual(prData)

    unmount()

    await act(async () => {
      render(<PullRequestLayout />)
    })

    expect(usePullRequestStore.getState().pullRequest).toEqual(prData)
  })
})
