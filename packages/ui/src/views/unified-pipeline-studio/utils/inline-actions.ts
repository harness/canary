import { SelectorType, type InlineAction, type PathSelector } from '@harnessio/yaml-editor'

export type InlineActionArgsType = {
  entityType: 'stages' | 'stage' | 'step' | 'inputs' | 'input' | 'group'
  action: 'edit' | 'delete' | 'add' | 'manage'
  position?: 'in' | 'after' | 'before'
}

export const getInlineActionConfig = (
  onClick: InlineAction<InlineActionArgsType>['onClick']
): {
  selectors: PathSelector[]
  actions: InlineAction<InlineActionArgsType>[]
}[] => [
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/.steps$/] }],
    actions: [
      {
        title: 'Add step',
        onClick,
        data: {
          action: 'add',
          entityType: 'step',
          position: 'in'
        }
      }
      // {
      //   title: 'Edit',
      //   onClick,
      //   data: {
      //     action: 'edit',
      //     entityType: 'step'
      //   }
      // }
    ]
  },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/.steps.\d+$/] }],
    actions: [
      {
        title: 'Edit',
        onClick,
        data: {
          action: 'edit',
          entityType: 'step'
        }
      }
      // ,
      // {
      //   title: 'Delete',
      //   onClick,
      //   data: {
      //     action: 'delete',
      //     entityType: 'step'
      //   }
      // }
    ]
  },
  // {
  //   selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/^inputs$/] }],
  //   actions: [
  //     {
  //       title: 'manage',
  //       onClick,
  //       data: {
  //         action: 'manage',
  //         entityType: 'inputs'
  //       }
  //     },
  //     {
  //       title: 'add',
  //       onClick,
  //       data: {
  //         action: 'add',
  //         entityType: 'inputs'
  //       }
  //     }
  //   ]
  // },
  // {
  //   selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/inputs.\d+$/] }],
  //   actions: [
  //     {
  //       title: 'edit',
  //       onClick,
  //       data: {
  //         action: 'edit',
  //         entityType: 'input'
  //       }
  //     }
  //   ]
  // },
  //   {
  //     selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/^pipeline$/] }],
  //     actions: [
  //       {
  //         title: 'Pipeline settings',
  //         onClick
  //       }
  //     ]
  //   },
  // {
  //   selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/^pipeline.stages$/] }],
  //   actions: [
  //     {
  //       title: 'add',
  //       onClick,
  //       data: {
  //         action: 'add',
  //         entityType: 'stage'
  //       }
  //     }
  //   ]
  // },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline', paths: [/^.stages.\d+$/] }],
    actions: [
      {
        title: 'Edit stage',
        onClick,
        data: {
          action: 'edit',
          entityType: 'stage'
        }
      }
    ]
  }
  // {
  //   selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline', paths: [/.group$/] }],
  //   actions: [
  //     {
  //       title: 'edit',
  //       onClick,
  //       data: {
  //         action: 'edit',
  //         entityType: 'group'
  //       }
  //     }
  //   ]
  // }
]
