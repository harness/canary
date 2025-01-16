import { create } from 'zustand'

import { ILabelsStore, ILabelType } from '@harnessio/ui/views'

export const useRepoLabelsStore = create<ILabelsStore>(set => ({
  labels: [],
  presetEditLabel: null,
  page: 1,
  totalPages: 1,
  setPage: page => set({ page }),
  setLabels: labels => set({ labels }),
  addLabel: (label: ILabelType) => set(state => ({ labels: [...state.labels, label] })),
  deleteLabel: (key: string) => set(state => ({ labels: state.labels.filter(label => label.key !== key) })),
  setPresetEditLabel: (label: ILabelType | null) => set({ presetEditLabel: label })
}))
