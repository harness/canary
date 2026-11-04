import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LineTitle } from '../pull-request-accordian'

vi.mock('@views', () => ({ getFileViewedState: vi.fn() }))
vi.mock('@views/repo/pull-request/components/pull-request-diff-viewer', () => ({ default: () => null }))
vi.mock('@views/repo/pull-request/details/pull-request-utils', () => ({ FILE_VIEWED_OBSOLETE_SHA: 'obsolete' }))
vi.mock('@views/repo/pull-request/hooks/useDiffConfig', () => ({ useDiffConfig: vi.fn() }))
vi.mock('@views/repo/pull-request/utils', () => ({
  parseStartingLineIfOne: vi.fn(),
  PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT: 1000
}))
vi.mock('@harnessio/ui/context', () => ({
  useTranslation: () => ({ t: (key: string) => (key === 'views:pullRequests.markViewed' ? 'Viewed' : key) })
}))

describe('LineTitle viewed checkbox', () => {
  afterEach(cleanup)

  it('calls markViewed exactly once when the label text is clicked', () => {
    const markViewed = vi.fn()
    const unmarkViewed = vi.fn()
    const setViewed = vi.fn()
    const setCollapsed = vi.fn()

    render(
      <LineTitle
        header={{ text: 'a.ts', filePath: 'a.ts', checksumAfter: 'abc' } as any}
        viewed={false}
        setViewed={setViewed}
        showViewed
        markViewed={markViewed}
        unmarkViewed={unmarkViewed}
        setCollapsed={setCollapsed}
        toggleFullDiff={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText('Viewed'))

    expect(markViewed).toHaveBeenCalledTimes(1)
    expect(markViewed).toHaveBeenCalledWith('a.ts', 'abc')
    expect(unmarkViewed).not.toHaveBeenCalled()
  })
})
