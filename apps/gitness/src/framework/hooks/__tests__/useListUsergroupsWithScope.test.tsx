import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useListUsergroupsQuery,
  useListUsergroupsScopedQuery,
  type ListUsergroupsProps
} from '@harnessio/code-service-client'

import { FeatureFlag } from '../../context/MFEContext'
import { useListUsergroupsWithScope } from '../useListUsergroupsWithScope'
import { useMFEContext } from '../useMFEContext'

vi.mock('@harnessio/code-service-client', () => ({
  useListUsergroupsQuery: vi.fn(),
  useListUsergroupsScopedQuery: vi.fn()
}))
vi.mock('../useMFEContext', () => ({ useMFEContext: vi.fn() }))

const legacyResult = {
  data: { body: [{ identifier: 'legacy' }] },
  isLoading: false,
  error: null,
  refetch: vi.fn()
}
const scopedResult = {
  data: { body: [{ identifier: 'scoped' }] },
  isLoading: true,
  error: new Error('scoped error'),
  refetch: vi.fn()
}
const props: ListUsergroupsProps = {
  space_ref: 'org/project/+',
  queryParams: { page: 1, limit: 100, query: 'team' }
}
let hookResult: ReturnType<typeof useListUsergroupsWithScope> | undefined

function HookHarness({
  options,
  hookProps = props
}: {
  options?: Parameters<typeof useListUsergroupsWithScope>[1]
  hookProps?: ListUsergroupsProps
}) {
  hookResult = useListUsergroupsWithScope(hookProps, options)
  return null
}

function setContext(scopedEnabled: boolean, accountId = 'account') {
  vi.mocked(useMFEContext).mockReturnValue({
    scope: {
      accountId,
      orgIdentifier: 'org',
      projectIdentifier: 'project'
    },
    customHooks: {
      useFeatureFlags: () => ({
        [FeatureFlag.CODE_PRINCIPALS_SCOPED_LISTING]: scopedEnabled
      })
    }
  } as ReturnType<typeof useMFEContext>)
}

describe('useListUsergroupsWithScope', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useListUsergroupsQuery).mockReturnValue(
      legacyResult as unknown as ReturnType<typeof useListUsergroupsQuery>
    )
    vi.mocked(useListUsergroupsScopedQuery).mockReturnValue(
      scopedResult as unknown as ReturnType<typeof useListUsergroupsScopedQuery>
    )
  })

  it('preserves space_ref and returns only the enabled legacy query', () => {
    setContext(false)

    render(<HookHarness />)

    expect(useListUsergroupsQuery).toHaveBeenCalledWith(props, { enabled: true })
    expect(useListUsergroupsScopedQuery).toHaveBeenCalledWith(expect.any(Object), { enabled: false })
    expect(hookResult).toBe(legacyResult)
  })

  it('uses explicit scope and excludes space_ref from the scoped request', () => {
    setContext(true)

    render(<HookHarness />)

    expect(useListUsergroupsQuery).toHaveBeenCalledWith(props, { enabled: false })
    expect(useListUsergroupsScopedQuery).toHaveBeenCalledWith(
      {
        queryParams: {
          accountIdentifier: 'account',
          orgIdentifier: 'org',
          projectIdentifier: 'project',
          page: 1,
          limit: 100,
          query: 'team'
        }
      },
      { enabled: true }
    )
    expect(hookResult).toBe(scopedResult)
  })

  it('forwards non-query fetcher options and omits space_ref from the scoped request', () => {
    setContext(true)
    const propsWithHeaders: ListUsergroupsProps = {
      ...props,
      headers: { 'X-Custom': 'value' }
    }

    render(<HookHarness hookProps={propsWithHeaders} />)

    expect(useListUsergroupsQuery).toHaveBeenCalledWith(propsWithHeaders, { enabled: false })
    expect(useListUsergroupsScopedQuery).toHaveBeenCalledWith(
      {
        headers: { 'X-Custom': 'value' },
        queryParams: {
          accountIdentifier: 'account',
          orgIdentifier: 'org',
          projectIdentifier: 'project',
          page: 1,
          limit: 100,
          query: 'team'
        }
      },
      { enabled: true }
    )
    expect(hookResult).toBe(scopedResult)
  })

  it('preserves caller gating by disabling both requests', () => {
    setContext(true)

    render(<HookHarness options={{ enabled: false, retry: false }} />)

    expect(useListUsergroupsQuery).toHaveBeenCalledWith(props, {
      enabled: false,
      retry: false
    })
    expect(useListUsergroupsScopedQuery).toHaveBeenCalledWith(expect.any(Object), { enabled: false, retry: false })
  })

  it('does not fall back when scoped listing lacks an account identifier', () => {
    setContext(true, '')

    render(<HookHarness />)

    expect(useListUsergroupsQuery).toHaveBeenCalledWith(props, { enabled: false })
    expect(useListUsergroupsScopedQuery).toHaveBeenCalledWith(expect.any(Object), { enabled: false })
    expect(hookResult).toBe(scopedResult)
  })
})
