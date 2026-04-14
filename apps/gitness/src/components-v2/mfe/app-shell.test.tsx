import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { defaultContext, FeatureFlag, MFEContext } from '../../framework/context/MFEContext'
import { AppShellMFE } from './app-shell'

/** Scoped to this file so shared Vitest mocks stay unchanged. */
vi.mock('@harnessio/views', () => ({
  MainContentLayout: (props: { children?: unknown; withBreadcrumbs?: boolean; className?: string }) => (
    <div
      data-testid="main-content-layout"
      data-with-breadcrumbs={String(!!props.withBreadcrumbs)}
      className={props.className}
    >
      {props.children}
    </div>
  )
}))

vi.mock('@harnessio/ui/components', () => ({
  Toaster: () => null
}))

vi.mock('../../framework/hooks/useSpaceSSEWithPubSub', () => ({ default: vi.fn() }))
vi.mock('../../framework/hooks/useGetSpaceParam', () => ({ useGetSpaceURLParam: () => '' }))

const breadcrumbMatches = vi.hoisted(() => ({ list: [] as unknown[] }))

vi.mock('../breadcrumbs/useGetBreadcrumbs', () => ({
  useGetBreadcrumbs: () => ({ breadcrumbs: breadcrumbMatches.list })
}))

vi.mock('../breadcrumbs/breadcrumbs', () => ({
  Breadcrumbs: ({ breadcrumbs }: { breadcrumbs: unknown[] }) =>
    breadcrumbs.length > 0 ? <div data-testid="mfe-legacy-breadcrumbs-bar" /> : null
}))

function renderAppShell(flags: Record<string, boolean | undefined>) {
  return render(
    <MFEContext.Provider
      value={{
        ...defaultContext,
        customHooks: {
          ...defaultContext.customHooks,
          useFeatureFlags: () => flags
        }
      }}
    >
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AppShellMFE />}>
            <Route index element={<div>child</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </MFEContext.Provider>
  )
}

describe('AppShellMFE: show or hide the in-MFE breadcrumb based on platform shell flags and unified opt-in', () => {
  beforeEach(() => {
    breadcrumbMatches.list = []
    localStorage.clear()
  })

  it('shows the breadcrumb on old UI when the route has breadcrumbs', () => {
    breadcrumbMatches.list = [{}]
    renderAppShell({})
    expect(screen.getByTestId('mfe-legacy-breadcrumbs-bar')).toBeTruthy()
    expect(screen.getByTestId('main-content-layout').getAttribute('data-with-breadcrumbs')).toBe('true')
  })

  it('hides the breadcrumb when the route has no breadcrumbs', () => {
    renderAppShell({})
    expect(screen.queryByTestId('mfe-legacy-breadcrumbs-bar')).toBeNull()
    expect(screen.getByTestId('main-content-layout').getAttribute('data-with-breadcrumbs')).toBe('false')
  })

  it('hides the breadcrumb when PL_ENABLE_CANARY_UI is on', () => {
    breadcrumbMatches.list = [{}]
    renderAppShell({ [FeatureFlag.PL_ENABLE_CANARY_UI]: true })
    expect(screen.queryByTestId('mfe-legacy-breadcrumbs-bar')).toBeNull()
    expect(screen.getByTestId('main-content-layout').getAttribute('data-with-breadcrumbs')).toBe('false')
  })

  it('hides the breadcrumb when unified opt-in is on and the user turned unified UI on', () => {
    localStorage.setItem('enable_unified_experience', 'true')
    breadcrumbMatches.list = [{}]
    renderAppShell({ [FeatureFlag.PL_UNIFIED_OPT_IN_ENABLED]: true })
    expect(screen.queryByTestId('mfe-legacy-breadcrumbs-bar')).toBeNull()
    expect(screen.getByTestId('main-content-layout').getAttribute('data-with-breadcrumbs')).toBe('false')
  })

  it('shows the breadcrumb when unified opt-in is on but the user did not turn unified UI on', () => {
    localStorage.removeItem('enable_unified_experience')
    breadcrumbMatches.list = [{}]
    renderAppShell({ [FeatureFlag.PL_UNIFIED_OPT_IN_ENABLED]: true })
    expect(screen.getByTestId('mfe-legacy-breadcrumbs-bar')).toBeTruthy()
    expect(screen.getByTestId('main-content-layout').getAttribute('data-with-breadcrumbs')).toBe('true')
  })
})
