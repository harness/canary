import { NavbarItemType } from '@components/app-sidebar'

const RECENT_KEY = 'nav_recent_menu'
const PINNED_KEY = 'nav_pinned_menu'

const mockPinnedItems: NavbarItemType[] = [{ title: 'Repositories', to: '/', id: '1', iconName: 'account' }]

const mockRecentItems: NavbarItemType[] = [
  { title: 'Connectors', to: '/connectors', id: '2', iconName: 'connectors' },
  { title: 'Secrets', to: '/secrets', id: '2', iconName: 'key' },
  {
    title: 'Builds',
    to: '/builds',
    id: '3',
    iconName: 'builds',
    subItems: [
      { title: 'Pipelines', to: '/builds/pipelines', id: '3-1', iconName: 'pipeline' },
      { title: 'Overview', to: '/builds/overview', id: '3-2', iconName: 'settings' }
    ]
  }
]

const setLocal = (key: string, value: NavbarItemType[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // do nothing
  }
}

export const useNav = () => {
  const recentMenu = mockRecentItems
  const pinnedMenu = mockPinnedItems

  const setRecent = (item: NavbarItemType, remove?: boolean) => {
    let updated: NavbarItemType[]
    if (remove) {
      updated = recentMenu.filter(i => i.title !== item.title)
    } else {
      const filtered = recentMenu.filter(i => i.title !== item.title)
      updated = [item, ...filtered]
    }
    setLocal(RECENT_KEY, updated)
  }

  const setPinned = (item: NavbarItemType, pin: boolean) => {
    let updated: NavbarItemType[]
    if (pin) {
      if (pinnedMenu.some(i => i.title === item.title)) {
        updated = pinnedMenu
      } else {
        updated = [...pinnedMenu, item]
      }
    } else {
      updated = pinnedMenu.filter(i => i.title !== item.title)
    }
    setLocal(PINNED_KEY, updated)
  }

  const setNavLinks = ({ recents, pinned }: { recents: NavbarItemType[]; pinned: NavbarItemType[] }) => {
    setLocal(RECENT_KEY, recents)
    setLocal(PINNED_KEY, pinned)
  }

  return { recentMenu, setRecent, pinnedMenu, setPinned, setNavLinks }
}
