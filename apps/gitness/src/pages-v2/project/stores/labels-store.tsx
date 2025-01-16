import { create } from 'zustand'

import { ILabelsStore, ILabelType, LabelValueType } from '@harnessio/ui/views'

export const useLabelsStore = create<ILabelsStore>(set => ({
  labels: [],
  presetEditLabel: null,
  totalPages: 1,
  page: 1,
  values: {},
  space_ref: null,

  setLabels: labels => set({ labels }),
  addLabel: (label: ILabelType) => set(state => ({ labels: [...state.labels, label] })),
  deleteLabel: (key: string) => set(state => ({ labels: state.labels.filter(label => label.key !== key) })),
  setPresetEditLabel: (label: ILabelType | null) => set({ presetEditLabel: label }),
  setPage: (page: number) => set({ page }),
  setValues: (values: Record<string, LabelValueType[]>) => set({ values }),
  setRepoSpaceRef: (space_ref?: string) => set({ space_ref })
}))
