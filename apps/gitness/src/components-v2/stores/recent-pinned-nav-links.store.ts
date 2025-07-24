import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import type { NavState } from '@harnessio/ui/components'

const navStateCreator: StateCreator<NavState> = set => ({
  recentMenu: [],
  pinnedMenu: [],

  setRecent: (route, remove = false) =>
    set(state => {
      let copyRecent = [...state.recentMenu]

      if (remove) {
        copyRecent = copyRecent.filter(item => item.id !== route.id)
      } else {
        // Check if the route already exists in the history
        if (state.recentMenu.find(item => item.id === route.id)) return state

        // Check if the route already exists in the pinned list
        if (state.pinnedMenu.find(item => item.id === route.id)) return state

        copyRecent = [route, ...state.recentMenu.slice(0, 4)]
      }

      // Prepend the route to history, limiting to 5 items
      return {
        pinnedMenu: state.pinnedMenu,
        recentMenu: copyRecent
      }
    }),

  setPinned: (route, pin) =>
    set(state => {
      // Make shallow copies of the lists
      let copyPinned = [...state.pinnedMenu]
      let copyRecent = [...state.recentMenu]

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
        pinnedMenu: copyPinned,
        recentMenu: copyRecent
      }
    }),

  setNavLinks: ({ pinnedMenu, recentMenu }) =>
    set(state => ({
      // Updates the pinned and recent navigation items in the state
      pinnedMenu: pinnedMenu ?? state.pinnedMenu,
      recentMenu: recentMenu ?? state.recentMenu
    }))
})

export const useNav = create(
  persist(navStateCreator, {
    // localStorage key
    name: 'nav-items',
    version: 1.1
  })
)
