import { create } from 'zustand'

import {
  BranchData,
  BranchSelectorListItem,
  BranchSelectorTab,
  IBranchSelectorStore,
  IBranchStateStore
} from '@harnessio/ui/views'

const defaultBranchState: IBranchStateStore = {
  defaultBranch: '',
  branchList: [],
  tagList: [{ name: '', sha: '' }],
  selectedBranchTag: { name: '', sha: '' },
  selectedRefType: BranchSelectorTab.BRANCHES,
  page: 1,
  xNextPage: 0,
  xPrevPage: 0,
  spaceId: '',
  repoId: ''
}

const store = create<IBranchSelectorStore>((set, get) => ({
  // Default state
  ...defaultBranchState,
  // Namespaced state management
  states: {},
  getState: namespace => get().states[namespace] || defaultBranchState,
  setState: (namespace, updates) =>
    set(store => ({
      states: {
        ...store.states,
        [namespace]: {
          ...store.getState(namespace),
          ...updates
        }
      }
    })),

  // Methods
  setBranchList: branches => set({ branchList: branches }),
  setDefaultBranch: branchName => set({ defaultBranch: branchName }),
  setSelectedBranchTag: branch => set({ selectedBranchTag: branch }),
  setSelectedRefType: refType => set({ selectedRefType: refType }),
  setTagList: tags => set({ tagList: tags }),
  setPage: page => set({ page }),
  setPaginationFromHeaders: (xNextPage, xPrevPage) => set({ xNextPage, xPrevPage }),
  setSpaceIdAndRepoId: (spaceId, repoId) => set({ spaceId, repoId })
}))

/**
 * Hook for managing repository branch state.
 * Supports two modes of operation:
 * 1. Global state (without namespace)
 * 2. Isolated state (with namespace)
 *
 * Isolated state is useful when you have multiple independent components
 * working with branches on the same page (e.g., branch list and modal dialog).
 * This prevents state conflicts between components.
 *
 * @param namespace - Optional identifier for isolated state
 *
 * @example
 * // Global state usage
 * const globalStore = useRepoBranchesStore()
 * globalStore.setBranchList(branches)
 * globalStore.setSelectedBranchTag(branch)
 *
 * // Isolated state for different components
 * const listStore = useRepoBranchesStore('branch-list')
 * const modalStore = useRepoBranchesStore('branch-modal')
 *
 * // Each store has its own independent state
 * listStore.setPage(1)
 * modalStore.setPage(2)
 *
 * // Global properties (spaceId, repoId) are shared between all instances
 * listStore.setSpaceIdAndRepoId('space1', 'repo1')
 */
export const useRepoBranchesStore = (namespace?: string) => {
  const baseStore = store()

  if (!namespace) {
    return baseStore
  }

  const state = baseStore.getState(namespace)

  return {
    // State
    ...state,
    spaceId: baseStore.spaceId,
    repoId: baseStore.repoId,
    states: baseStore.states,
    getState: baseStore.getState,
    setState: baseStore.setState,

    // Methods
    setBranchList: (branches: BranchData[]) => baseStore.setState(namespace, { branchList: branches }),
    setDefaultBranch: (branchName: string) => baseStore.setState(namespace, { defaultBranch: branchName }),
    setSelectedBranchTag: (branch: BranchSelectorListItem) =>
      baseStore.setState(namespace, { selectedBranchTag: branch }),
    setSelectedRefType: (refType: BranchSelectorTab) => baseStore.setState(namespace, { selectedRefType: refType }),
    setTagList: (tags: BranchSelectorListItem[]) => baseStore.setState(namespace, { tagList: tags }),
    setPage: (page: number) => baseStore.setState(namespace, { page }),
    setPaginationFromHeaders: (xNextPage: number, xPrevPage: number) =>
      baseStore.setState(namespace, { xNextPage, xPrevPage }),
    setSpaceIdAndRepoId: (spaceId: string, repoId: string) => baseStore.setState(namespace, { spaceId, repoId })
  }
}
