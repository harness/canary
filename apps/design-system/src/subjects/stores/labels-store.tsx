import {
  ColorsEnum,
  ILabelsStore,
  ILabelType,
  LabelType,
  LabelValueType,
  SetRepoSpaceRefProps
} from '@harnessio/ui/views'

interface RepoLabelsListStore {
  useLabelsStore: () => ILabelsStore
}

export const LabelsListStore: RepoLabelsListStore = {
  useLabelsStore: () => ({
    labels: [
      {
        id: 31,
        repo_id: 2,
        scope: 0,
        key: 'label-1',
        description: 'sample label',
        type: LabelType.STATIC,
        color: ColorsEnum.INDIGO,
        value_count: 0,
        created: 1736962206814,
        updated: 1736962206814,
        created_by: 4,
        updated_by: 4,
        space_id: null
      },
      {
        id: 27,
        repo_id: 2,
        scope: 0,
        key: 'label-2',
        description: 'sample label 2',
        type: LabelType.STATIC,
        color: ColorsEnum.RED,
        value_count: 2,
        created: 1736884858874,
        updated: 1736884858874,
        created_by: 4,
        updated_by: 4,
        space_id: null
      }
    ],

    totalItems: 1,
    pageSize: 10,
    page: 1,
    repo_ref: 'canary',
    space_ref: 'P1org',
    values: {
      'label-1': [
        {
          id: 4,
          label_id: 27,
          value: 'value1',
          color: ColorsEnum.BROWN,
          created: 1736884858877,
          created_by: 4,
          updated: 1736925926933,
          updated_by: 4
        },
        {
          id: 5,
          label_id: 27,
          value: 'value2',
          color: ColorsEnum.VIOLET,
          created: 1736884887529,
          created_by: 4,
          updated: 1736925926934,
          updated_by: 4
        }
      ]
    },
    isLoading: false,

    getParentScopeLabels: false,

    setLabels: (_: ILabelType[]) => {},

    addLabel: (_: ILabelType) => {},

    deleteLabel: (_: string) => {},
    setIsLoading: (_: boolean) => {},

    setValues: (_: Record<string, LabelValueType[]>) => {},
    setRepoSpaceRef: (_: SetRepoSpaceRefProps) => {},
    setGetParentScopeLabels: (_: boolean) => {},
    setPage: (_: number) => {},
    resetLabelsAndValues: () => {}
  })
}
