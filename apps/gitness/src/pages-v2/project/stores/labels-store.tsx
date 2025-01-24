import { create } from 'zustand'

import { ILabelsStore, ILabelType, LabelValuesType, SetRepoSpaceRefProps } from '@harnessio/ui/views'

export const useLabelsStore = create<ILabelsStore>(set => ({
  labels: [],
  totalPages: 1,
  page: 1,

  values: {},
  space_ref: null,
  repo_ref: null,
  getParentScopeLabels: false,

  setLabels: labels => set({ labels }),
  addLabel: (label: ILabelType) => set(state => ({ labels: [...state.labels, label] })),

  deleteLabel: (key: string) => set(state => ({ labels: state.labels.filter(label => label.key !== key) })),
  setPage: (page: number) => set({ page }),

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
