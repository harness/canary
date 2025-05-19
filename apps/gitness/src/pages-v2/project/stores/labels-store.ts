import { create } from 'zustand'

import { ILabelsStore, ILabelType, LabelValuesType, SetRepoSpaceRefProps } from '@harnessio/ui/views'

export const useLabelsStore = create<ILabelsStore>(set => ({
  labels: [],
  totalItems: 0,
  pageSize: 10,
  page: 1,
  isLoading: true,
  values: {},
  space_ref: null,
  repo_ref: null,
  getParentScopeLabels: false,

  setLabels: (labels: ILabelType[], paginationData: { totalItems: number; pageSize: number }) =>
    set({ labels, ...paginationData }),

  addLabel: (label: ILabelType) => set(state => ({ labels: [...state.labels, label] })),

  deleteLabel: (key: string) => set(state => ({ labels: state.labels.filter(label => label.key !== key) })),
  setPage: (page: number) => set({ page }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  setValues: (values: LabelValuesType) => set({ values }),
  setRepoSpaceRef: ({ repo_ref, space_ref }: SetRepoSpaceRefProps) => set({ repo_ref, space_ref }),
  setGetParentScopeLabels: (getParentScopeLabels: boolean) => set({ getParentScopeLabels }),

  resetLabelsAndValues: () => {
    set(state => {
      state.labels = []
      state.values = {}
      return { labels: [], values: {} }
    })
  }
}))
