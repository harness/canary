import { Icon } from '@harnessio/ui/components'

export const executionMock = [
  {
    type: 'Start',
    config: {
      width: 40,
      height: 40,
      hideDeleteButton: true,
      hideBeforeAdd: true,
      hideLeftPort: true
    },
    data: {},
    path: 'pipeline.children.0',
    containerType: 'leaf'
  },
  {
    type: 'SerialStageGroup',
    config: {
      minWidth: 192,
      minHeight: 40,
      hideDeleteButton: true,
      hideBeforeAdd: true,
      hideAfterAdd: true
    },
    data: {
      yamlPath: 'pipeline.stages.0',
      yamlChildrenPath: 'pipeline.stages.0.group.stages',
      yamlEntityType: 'SerialStageGroup',
      name: 'Serial 1',
      state: 'executing'
    },
    children: [
      {
        type: 'ParallelStageGroup',
        config: {
          minWidth: 192,
          minHeight: 40,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: 'pipeline.stages.0.group.stages.0',
          yamlChildrenPath: 'pipeline.stages.0.group.stages.0.parallel.stages',
          yamlEntityType: 'ParallelStageGroup',
          name: 'Parallel 1'
        },
        children: [
          {
            type: 'Stage',
            config: {
              minWidth: 192,
              minHeight: 40,
              hideDeleteButton: true,
              hideBeforeAdd: true,
              hideAfterAdd: true
            },
            data: {
              yamlPath: 'pipeline.stages.0.group.stages.0.parallel.stages.0',
              yamlChildrenPath: 'pipeline.stages.0.group.stages.0.parallel.stages.0.steps',
              yamlEntityType: 'Stage',
              state: 'success',
              name: 'Stage 1'
            },
            children: [
              {
                type: 'Step',
                config: {
                  maxWidth: 140,
                  width: 140,
                  hideDeleteButton: false,
                  selectable: true
                },
                data: {
                  yamlPath: 'pipeline.stages.0.group.stages.0.parallel.stages.0.steps.0',
                  yamlEntityType: 'Step',
                  name: 'go build',
                  icon: <Icon className="m-2 size-8" name={'harness-plugin'} />,
                  state: 'success',
                  selected: false
                },
                path: 'pipeline.children.1.children.0.children.0.children.0',
                containerType: 'leaf'
              },
              {
                type: 'Step',
                config: {
                  maxWidth: 140,
                  width: 140,
                  hideDeleteButton: false,
                  selectable: true
                },
                data: {
                  yamlPath: 'pipeline.stages.0.group.stages.0.parallel.stages.0.steps.1',
                  yamlEntityType: 'Step',
                  name: 'go test',
                  icon: <Icon className="m-2 size-8" name={'run'} />,
                  state: 'warning',
                  selected: false
                },
                path: 'pipeline.children.1.children.0.children.0.children.1',
                containerType: 'leaf'
              }
            ],
            path: 'pipeline.children.1.children.0.children.0',
            containerType: 'serial'
          },
          {
            type: 'Stage',
            config: {
              minWidth: 192,
              minHeight: 40,
              hideDeleteButton: true,
              hideBeforeAdd: true,
              hideAfterAdd: true
            },
            data: {
              yamlPath: 'pipeline.stages.0.group.stages.0.parallel.stages.1',
              yamlChildrenPath: 'pipeline.stages.0.group.stages.0.parallel.stages.1.steps',
              yamlEntityType: 'Stage',
              name: 'Stage 2',
              state: 'executing'
            },
            children: [
              {
                type: 'Step',
                config: {
                  maxWidth: 140,
                  width: 140,
                  hideDeleteButton: false,
                  selectable: true
                },
                data: {
                  yamlPath: 'pipeline.stages.0.group.stages.0.parallel.stages.1.steps.0',
                  yamlEntityType: 'Step',
                  name: 'npm test',
                  icon: <Icon className="m-2 size-8" name={'run'} />,
                  state: 'warning',
                  selected: false
                },
                path: 'pipeline.children.1.children.0.children.1.children.0',
                containerType: 'leaf'
              }
            ],
            path: 'pipeline.children.1.children.0.children.1',
            containerType: 'serial'
          }
        ],
        path: 'pipeline.children.1.children.0',
        containerType: 'parallel'
      },
      {
        type: 'SerialStageGroup',
        config: {
          minWidth: 192,
          minHeight: 40,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: 'pipeline.stages.0.group.stages.1',
          yamlChildrenPath: 'pipeline.stages.0.group.stages.1.group.stages',
          yamlEntityType: 'SerialStageGroup',
          name: 'Serial 2',
          state: 'success'
        },
        children: [
          {
            type: 'Stage',
            config: {
              minWidth: 192,
              minHeight: 40,
              hideDeleteButton: true,
              hideBeforeAdd: true,
              hideAfterAdd: true
            },
            data: {
              yamlPath: 'pipeline.stages.0.group.stages.1.group.stages.0',
              yamlChildrenPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps',
              yamlEntityType: 'Stage',
              state: 'warning',
              name: 'Stage 1'
            },
            children: [
              {
                type: 'SerialStepGroup',
                config: {
                  minWidth: 192,
                  minHeight: 40,
                  hideDeleteButton: true,
                  hideCollapseButton: false
                },
                data: {
                  yamlPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.0',
                  yamlChildrenPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.0.group.steps',
                  yamlEntityType: 'SerialStepGroup',
                  name: 'Serial steps 1'
                },
                children: [
                  {
                    type: 'Step',
                    config: {
                      maxWidth: 140,
                      width: 140,
                      hideDeleteButton: false,
                      selectable: true
                    },
                    data: {
                      yamlPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.0.group.steps.0',
                      yamlEntityType: 'Step',
                      name: 'go build',
                      icon: <Icon className="m-2 size-8" name={'run'} />,
                      state: 'success',
                      selected: false
                    },
                    path: 'pipeline.children.1.children.1.children.0.children.0.children.0',
                    containerType: 'leaf'
                  },
                  {
                    type: 'Step',
                    config: {
                      maxWidth: 140,
                      width: 140,
                      hideDeleteButton: false,
                      selectable: true
                    },
                    data: {
                      yamlPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.0.group.steps.1',
                      yamlEntityType: 'Step',
                      name: 'go test',
                      icon: <Icon className="m-2 size-8" name={'run'} />,
                      state: 'executing',
                      selected: false
                    },
                    path: 'pipeline.children.1.children.1.children.0.children.0.children.1',
                    containerType: 'leaf'
                  }
                ],
                path: 'pipeline.children.1.children.1.children.0.children.0',
                containerType: 'serial'
              },
              {
                type: 'ParallelStepGroup',
                config: {
                  minWidth: 192,
                  minHeight: 40,
                  hideDeleteButton: true
                },
                data: {
                  yamlPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.1',
                  yamlChildrenPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.1.parallel.steps',
                  yamlEntityType: 'ParallelStepGroup',
                  name: 'Parallel steps 2'
                },
                children: [
                  {
                    type: 'Step',
                    config: {
                      maxWidth: 140,
                      width: 140,
                      hideDeleteButton: false,
                      selectable: true
                    },
                    data: {
                      yamlPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.1.parallel.steps.0',
                      yamlEntityType: 'Step',
                      name: 'go build',
                      icon: <Icon className="m-2 size-8" name={'run'} />,
                      state: 'success',
                      selected: false
                    },
                    path: 'pipeline.children.1.children.1.children.0.children.1.children.0',
                    containerType: 'leaf'
                  },
                  {
                    type: 'Step',
                    config: {
                      maxWidth: 140,
                      width: 140,
                      hideDeleteButton: false,
                      selectable: true
                    },
                    data: {
                      yamlPath: 'pipeline.stages.0.group.stages.1.group.stages.0.steps.1.parallel.steps.1',
                      yamlEntityType: 'Step',
                      name: 'go test',
                      icon: <Icon className="m-2 size-8" name={'run'} />,
                      state: 'executing',
                      selected: false
                    },
                    path: 'pipeline.children.1.children.1.children.0.children.1.children.1',
                    containerType: 'leaf'
                  }
                ],
                path: 'pipeline.children.1.children.1.children.0.children.1',
                containerType: 'parallel'
              }
            ],
            path: 'pipeline.children.1.children.1.children.0',
            containerType: 'serial'
          }
        ],
        path: 'pipeline.children.1.children.1',
        containerType: 'serial'
      }
    ],
    path: 'pipeline.children.1',
    containerType: 'serial'
  },
  {
    type: 'End',
    config: {
      width: 40,
      height: 40,
      hideDeleteButton: true,
      hideAfterAdd: true,
      hideRightPort: true
    },
    data: {},
    path: 'pipeline.children.2',
    containerType: 'leaf'
  }
]
