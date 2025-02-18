import { InlineAction, PathSelector, SelectorType } from '../../../../src'

export type InlineActionArgsType = {
  entityType: 'stage' | 'step' | 'inputs' | 'input' | 'pipeline'
  action: 'edit' | 'delete' | 'add' | 'manage'
}
export const getInlineActionExample = (args: {
  setSelectedPath: (path: string) => void
}): {
  selectors: PathSelector[]
  actions: InlineAction<InlineActionArgsType>[]
}[] => [
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/^inputs$/] }],
    actions: [
      {
        title: 'Manage inputs',
        onClick: eventData => {
          console.log(eventData)
        },
        data: {
          action: 'manage',
          entityType: 'inputs'
        }
      }
    ]
  },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/inputs.\d+$/] }],
    actions: [
      {
        title: 'Delete',
        onClick: eventData => {
          console.log(eventData)
        },
        data: {
          action: 'delete',
          entityType: 'input'
        }
      },
      {
        title: 'Select',
        onClick: eventData => {
          args.setSelectedPath(eventData.path)
        }
      }
    ]
  },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/^pipeline$/] }],
    actions: [
      {
        title: 'Pipeline settings',
        onClick: data => {
          console.log(data)
        }
      }
    ]
  },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: '', paths: [/^pipeline.stages$/] }],
    actions: [
      {
        title: 'Delete all stages',
        onClick: data => {
          console.log(data)
        }
      }
    ]
  },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline', paths: [/^.stages.\d+$/] }],
    actions: [
      {
        title: 'Add',
        onClick: data => {
          console.log(data)
        }
      },
      {
        title: 'Edit',
        onClick: data => {
          console.log(data)
        }
      },
      {
        title: 'Delete | << stage',
        onClick: data => {
          console.log(data)
        }
      }
    ]
  },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline', paths: [/.steps.\d+$/] }],
    actions: [
      {
        title: 'Add',
        onClick: data => {
          console.log(data)
        }
      },
      {
        title: 'Edit',
        onClick: data => {
          console.log(data)
        }
      },
      {
        title: 'Delete | << step',
        onClick: data => {
          console.log(data)
        }
      },
      {
        title: 'Select',
        onClick: eventData => {
          args.setSelectedPath(eventData.path)
        }
      }
    ]
  },
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline', paths: [/.group$/] }],
    actions: [
      {
        title: 'Add',
        onClick: data => {
          console.log(data)
        }
      },
      {
        title: 'Edit',
        onClick: data => {
          console.log(data)
        }
      },
      {
        title: 'Delete | << group',
        onClick: data => {
          console.log(data)
        }
      }
    ]
  }
]
