import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useListPrincipalsQuery,
  useListPrincipalsScopedQuery,
  type ListPrincipalsProps
} from '@harnessio/code-service-client'

import { FeatureFlag } from '../../context/MFEContext'
import { useGetRepoId } from '../useGetRepoId'
import { useListPrincipalsWithScope } from '../useListPrincipalsWithScope'
import { useMFEContext } from '../useMFEContext'

vi.mock('@harnessio/code-service-client', () => ({
  useListPrincipalsQuery: vi.fn(),
  useListPrincipalsScopedQuery: vi.fn()
}))
vi.mock('../useGetRepoId', () => ({ useGetRepoId: vi.fn() }))
vi.mock('../useMFEContext', () => ({ useMFEContext: vi.fn() }))

const legacyResult = {
  data: { body: [{ id: 1 }] },
  isLoading: false,
  error: null,
  refetch: vi.fn()
}
const scopedResult = {
  data: { body: [{ id: 2 }] },
  isLoading: true,
  error: new Error('scoped error'),
  refetch: vi.fn()
}
const props: ListPrincipalsProps = {
  queryParams: { page: 2, limit: 50, query: 'har', type: ['user'] },
  stringifyQueryParamsOptions: { arrayFormat: 'repeat' as const }
}
let hookResult: ReturnType<typeof useListPrincipalsWithScope> | undefined

function HookHarness({ options }: { options?: Parameters<typeof useListPrincipalsWithScope>[1] }) {
  hookResult = useListPrincipalsWithScope(props, options)
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

describe('useListPrincipalsWithScope', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGetRepoId).mockReturnValue('repo')
    vi.mocked(useListPrincipalsQuery).mockReturnValue(
      legacyResult as unknown as ReturnType<typeof useListPrincipalsQuery>
    )
    vi.mocked(useListPrincipalsScopedQuery).mockReturnValue(
      scopedResult as unknown as ReturnType<typeof useListPrincipalsScopedQuery>
    )
  })

  it('returns and enables only the legacy query when the flag is disabled', () => {
    setContext(false)

    render(<HookHarness />)

    expect(useListPrincipalsQuery).toHaveBeenCalledWith(props, { enabled: true })
    expect(useListPrincipalsScopedQuery).toHaveBeenCalledWith(expect.any(Object), { enabled: false })
    expect(hookResult).toBe(legacyResult)
  })

  it('returns and enables only the scoped query with explicit scope', () => {
    setContext(true)

    render(<HookHarness />)

    expect(useListPrincipalsQuery).toHaveBeenCalledWith(props, { enabled: false })
    expect(useListPrincipalsScopedQuery).toHaveBeenCalledWith(
      {
        stringifyQueryParamsOptions: { arrayFormat: 'repeat' },
        queryParams: {
          accountIdentifier: 'account',
          orgIdentifier: 'org',
          projectIdentifier: 'project',
          repoIdentifier: 'repo',
          page: 2,
          limit: 50,
          query: 'har',
          type: ['user']
        }
      },
      { enabled: true }
    )
    expect(hookResult).toBe(scopedResult)
  })

  it('disables both queries when the caller disables fetching', () => {
    setContext(true)

    render(<HookHarness options={{ enabled: false, retry: false }} />)

    expect(useListPrincipalsQuery).toHaveBeenCalledWith(props, {
      enabled: false,
      retry: false
    })
    expect(useListPrincipalsScopedQuery).toHaveBeenCalledWith(expect.any(Object), { enabled: false, retry: false })
  })

  it('does not fall back when scoped listing lacks an account identifier', () => {
    setContext(true, '')

    render(<HookHarness />)

    expect(useListPrincipalsQuery).toHaveBeenCalledWith(props, { enabled: false })
    expect(useListPrincipalsScopedQuery).toHaveBeenCalledWith(expect.any(Object), { enabled: false })
    expect(hookResult).toBe(scopedResult)
  })
})
