import { create } from 'zustand'

import { ILabelsStore, ILabelType } from '@harnessio/ui/views'

export const useLabelsStore = create<ILabelsStore>(set => ({
  labels: [],
  presetEditLabel: null,
  totalPages: 1,
  page: 1,

  setLabels: labels => set({ labels }),
  addLabel: (label: ILabelType) => set(state => ({ labels: [...state.labels, label] })),
  deleteLabel: (key: string) => set(state => ({ labels: state.labels.filter(label => label.key !== key) })),
  setPresetEditLabel: (label: ILabelType | null) => set({ presetEditLabel: label }),
  setPage: (page: number) => set({ page })
}))
