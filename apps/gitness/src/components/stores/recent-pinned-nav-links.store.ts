import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import { NavbarItemType } from '@harnessio/ui/components'

export interface NavState {
  recent: NavbarItemType[]
  pinned: NavbarItemType[]
  setRecent: (route: NavbarItemType) => void
  setPinned: (route: NavbarItemType, pin: boolean) => void
  setNavLinks: (links: Partial<Pick<NavState, 'pinned' | 'recent'>>) => void
}

const navStateCreator: StateCreator<NavState> = set => ({
  recent: [],
  pinned: [],

  setRecent: (route, remove = false) =>
    set(state => {
      let copyRecent = [...state.recent]

      if (remove) {
        copyRecent = copyRecent.filter(item => item.id !== route.id)
      } else {
        // Check if the route already exists in the history
        if (state.recent.find(item => item.id === route.id)) return state

        // Check if the route already exists in the pinned list
        if (state.pinned.find(item => item.id === route.id)) return state

        copyRecent = [route, ...state.recent.slice(0, 4)]
      }

      // Prepend the route to history, limiting to 5 items
      return {
        pinned: state.pinned,
        recent: copyRecent
      }
    }),

  setPinned: (route, pin) =>
    set(state => {
      // Make shallow copies of the lists
      let copyPinned = [...state.pinned]
      let copyRecent = [...state.recent]

      if (pin) {
        // Push the route to the pinned list
        copyPinned.push(route)

        // Remove the route from the recent list
        copyRecent = copyRecent.filter(item => item.id !== route.id)
      } else {
        // Remove the route from the pinned list
        copyPinned = copyPinned.filter(item => item.id !== route.id)
      }

      return {
        pinned: copyPinned,
        recent: copyRecent
      }
    }),

  setNavLinks: ({ pinned, recent }) =>
    set(state => ({
      // Updates the pinned and recent navigation items in the state
      pinned: pinned ?? state.pinned,
      recent: recent ?? state.recent
    }))
})

export const useNav = create(
  persist(navStateCreator, {
    // localStorage key
    name: 'nav-items',
    version: 1.0
  })
)
