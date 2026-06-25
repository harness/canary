import { render, screen } from '@testing-library/react'

import { PullRequestCommitPage } from '../pull-request-commits'

const mockUseListPullReqCommitsQuery = vi.fn()

// Capture the props handed to the view so we can assert that pagination inputs are derived
// from the commits query response headers (the fix for CODE-5595), not the shared PR store.
vi.mock('@harnessio/views', () => ({
  PullRequestCommitsView: (props: {
    currentPage?: number
    xNextPage?: number
    xPrevPage?: number
    pageSize?: number
  }) => (
    <div
      data-testid="commits-view"
      data-current-page={String(props.currentPage)}
      data-next-page={String(props.xNextPage)}
      data-prev-page={String(props.xPrevPage)}
      data-page-size={String(props.pageSize)}
    />
  )
}))

vi.mock('@harnessio/code-service-client', () => ({
  useListPullReqCommitsQuery: (args: unknown) => mockUseListPullReqCommitsQuery(args)
}))

vi.mock('../../../framework/context/NavigationContext', () => ({
  useRoutes: () => ({
    toRepoFiles: () => '/files',
    toRepoCommitDetails: () => '/commit',
    toPullRequestChange: () => '/change'
  })
}))

vi.mock('../../../framework/hooks/useGetRepoPath', () => ({
  useGetRepoRef: () => 'acc/org/proj/repo/+'
}))

let mockPage = 1
vi.mock('../../../framework/hooks/useQueryState', () => ({
  parseAsInteger: { withDefault: () => ({ parse: (v: string | null) => (v ? parseInt(v, 10) : 1) }) },
  useQueryState: () => [mockPage, vi.fn()]
}))

vi.mock('react-router-dom', () => ({
  useParams: () => ({ repoId: 'repo', spaceId: 'space', pullRequestId: '1' }),
  useLocation: () => ({ pathname: '/pr/1/commits' })
}))

const setQueryResult = ({
  headers,
  body = [{ sha: 'abc123' }],
  isFetching = false
}: {
  headers?: Record<string, string>
  body?: unknown
  isFetching?: boolean
}) => {
  mockUseListPullReqCommitsQuery.mockReturnValue({
    isFetching,
    data: { body, headers: headers ? new Headers(headers) : undefined }
  })
}

const getView = () => screen.getByTestId('commits-view')

describe('PullRequestCommitPage', () => {
  beforeEach(() => {
    mockPage = 1
    mockUseListPullReqCommitsQuery.mockReset()
  })

  test('derives next page from the x-next-page header on the first page (direct hit)', () => {
    setQueryResult({ headers: { 'x-next-page': '2' } })

    render(<PullRequestCommitPage />)

    const view = getView()
    expect(view.getAttribute('data-next-page')).toBe('2')
    // No previous page header on page 1 -> NaN -> treated as "no previous"
    expect(view.getAttribute('data-prev-page')).toBe('NaN')
    expect(view.getAttribute('data-current-page')).toBe('1')
    expect(view.getAttribute('data-page-size')).toBe('25')
  })

  test('derives both next and previous pages from headers on a middle page', () => {
    mockPage = 2
    setQueryResult({ headers: { 'x-next-page': '3', 'x-prev-page': '1' } })

    render(<PullRequestCommitPage />)

    const view = getView()
    expect(view.getAttribute('data-next-page')).toBe('3')
    expect(view.getAttribute('data-prev-page')).toBe('1')
    expect(view.getAttribute('data-current-page')).toBe('2')
  })

  test('exposes only previous page on the last page', () => {
    mockPage = 4
    setQueryResult({ headers: { 'x-prev-page': '3' } })

    render(<PullRequestCommitPage />)

    const view = getView()
    expect(view.getAttribute('data-next-page')).toBe('NaN')
    expect(view.getAttribute('data-prev-page')).toBe('3')
  })

  test('yields no pagination signals when the response has no pagination headers', () => {
    setQueryResult({ headers: undefined })

    render(<PullRequestCommitPage />)

    const view = getView()
    expect(view.getAttribute('data-next-page')).toBe('NaN')
    expect(view.getAttribute('data-prev-page')).toBe('NaN')
  })
})
