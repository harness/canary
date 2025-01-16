import { create } from 'zustand'

import { ILabelsStore, ILabelType, LabelValueType } from '@harnessio/ui/views'

export const useRepoLabelsStore = create<ILabelsStore>(set => ({
  labels: [],
  parentLabels: [],
  presetEditLabel: null,
  page: 1,
  totalPages: 1,
  values: {},
  repo_ref: null,
  space_ref: null,
  setPage: page => set({ page }),
  setLabels: labels => set({ labels }),
  addLabel: (label: ILabelType) => set(state => ({ labels: [...state.labels, label] })),
  deleteLabel: (key: string) => set(state => ({ labels: state.labels.filter(label => label.key !== key) })),
  setPresetEditLabel: (label: ILabelType | null) => set({ presetEditLabel: label }),
  setValues: (values: Record<string, LabelValueType[]>) => set({ values }),
  setParentLabels: (parentLabels: ILabelType[]) => set({ parentLabels }),
  setRepoSpaceRef: (repo_ref?: string, space_ref?: string) => set({ repo_ref, space_ref })
}))
