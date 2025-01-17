import { ColorsEnum, ILabelsStore, ILabelType, LabelValueType } from '@harnessio/ui/views'

interface RepoLabelsListStore {
  useLabelsStore: () => ILabelsStore
}
export const RepoLabelsListStore: RepoLabelsListStore = {
  useLabelsStore: () => ({
    spaceLabels: [],
    repoLabels: [
      {
        id: 31,
        repo_id: 2,
        scope: 0,
        key: 'ajshdas',
        description: 'askjldhaw',
        type: 'static',
        color: ColorsEnum.INDIGO,
        value_count: 0,
        created: 1736962206814,
        updated: 1736962206814,
        created_by: 4,
        updated_by: 4
      },
      {
        id: 27,
        repo_id: 2,
        scope: 0,
        key: 'asd',
        description: '',
        type: 'static',
        color: ColorsEnum.RED,
        value_count: 2,
        created: 1736884858874,
        updated: 1736884858874,
        created_by: 4,
        updated_by: 4
      }
    ],
    presetEditLabel: null,
    totalPages: 1,
    page: 1,
    repo_ref: 'canary',
    space_ref: 'P1org',
    spaceValues: {},
    repoValues: {
      ajshdas: [],
      asd: [
        {
          id: 4,
          label_id: 27,
          value: 'afdvfd',
          color: ColorsEnum.BROWN,
          created: 1736884858877,
          created_by: 4,
          updated: 1736925926933,
          updated_by: 4
        },
        {
          id: 5,
          label_id: 27,
          value: 'xc.m,vndaf',
          color: ColorsEnum.VIOLET,
          created: 1736884887529,
          created_by: 4,
          updated: 1736925926934,
          updated_by: 4
        }
      ]
    },
    getParentScopeLabels: false,
    setSpaceLabels: (_: ILabelType[]) => {},
    setRepoLabels: (_: ILabelType[]) => {},
    addSpaceLabel: (_: ILabelType) => {},
    addRepoLabel: (_: ILabelType) => {},
    setPresetEditLabel: (_: ILabelType | null) => {},
    deleteSpaceLabel: (_: string) => {},
    deleteRepoLabel: (_: string) => {},
    setSpaceValues: (_: LabelValueType) => {},
    setRepoValues: (_: Record<string, LabelValueType[]>) => {},
    setRepoSpaceRef: (_?: string) => {},
    setGetParentScopeLabels: (_: boolean) => {},
    setPage: (_: number) => {}
  })
}
