import { create } from 'zustand'

import { ILabelsStore, ILabelType, LabelValueType } from '@harnessio/ui/views'

export const useLabelsStore = create<ILabelsStore>(set => ({
  spaceLabels: [],
  repoLabels: [],
  presetEditLabel: null,
  totalPages: 1,
  page: 1,
  repoValues: {},
  spaceValues: {},
  space_ref: null,
  repo_ref: null,
  getParentScopeLabels: false,

  setSpaceLabels: labels => set({ spaceLabels: labels }),
  setRepoLabels: labels => set({ repoLabels: labels }),
  addSpaceLabel: (label: ILabelType) => set(state => ({ spaceLabels: [...state.spaceLabels, label] })),
  addRepoLabel: (label: ILabelType) => set(state => ({ repoLabels: [...state.repoLabels, label] })),
  deleteSpaceLabel: (key: string) =>
    set(state => ({ spaceLabels: state.spaceLabels.filter(label => label.key !== key) })),
  deleteRepoLabel: (key: string) => set(state => ({ repoLabels: state.repoLabels.filter(label => label.key !== key) })),
  setPresetEditLabel: (label: ILabelType | null) => set({ presetEditLabel: label }),
  setPage: (page: number) => set({ page }),
  setSpaceValues: (spaceValues: Record<string, LabelValueType[]>) => set({ spaceValues }),
  setRepoValues: (repoValues: Record<string, LabelValueType[]>) => set({ repoValues }),
  setRepoSpaceRef: (repo_ref?: string, space_ref?: string) => set({ repo_ref, space_ref }),
  setGetParentScopeLabels: (getParentScopeLabels: boolean) => set({ getParentScopeLabels })
}))
