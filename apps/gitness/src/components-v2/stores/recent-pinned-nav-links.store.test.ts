import { beforeEach, describe, expect, it } from 'vitest'

import type { NavbarItemType } from '@harnessio/ui/components'

import { useNav } from './recent-pinned-nav-links.store'

const item = { id: 'pipelines', to: '/pipelines' } as NavbarItemType

describe('recent-pinned-nav-links store', () => {
  beforeEach(() => {
    useNav.setState({ pinnedMenu: [], recentMenu: [] })
  })

  it('adds an active item to recents when unpinned followed by setRecent', () => {
    useNav.getState().setPinned(item, true)
    useNav.getState().setPinned(item, false)
    useNav.getState().setRecent(item)

    expect(useNav.getState().recentMenu).toContainEqual(item)
    expect(useNav.getState().pinnedMenu).not.toContainEqual(item)
  })

  it('does not add a pinned item to recents', () => {
    useNav.getState().setPinned(item, true)
    useNav.getState().setRecent(item)

    expect(useNav.getState().recentMenu).not.toContainEqual(item)
  })
})
