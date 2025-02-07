import { Icon } from '@harnessio/ui/components'

export const demoExecutionMock = [
  {
    type: 'Start',
    config: {
      width: 36,
      height: 36,
      hideDeleteButton: true,
      hideBeforeAdd: true,
      hideLeftPort: true
    },
    data: {},
    path: 'pipeline.children.0',
    containerType: 'leaf'
  },
  {
    type: 'ParallelStageGroup',
    config: {
      maxWidth: 200,
      minHeight: 50,
      hideDeleteButton: true,
      hideBeforeAdd: true,
      hideAfterAdd: true
    },
    data: {
      yamlPath: 'pipeline.stages.0',
      yamlChildrenPath: 'pipeline.stages.0.parallel.stages',
      yamlEntityType: 'ParallelStageGroup',
      name: 'Parallel 1',
      state: 'executing'
    },
    children: [
      {
        type: 'Stage',
        config: {
          minWidth: 200,
          minHeight: 50,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: 'pipeline.stages.0.parallel.stages.0',
          yamlChildrenPath: 'pipeline.stages.0.parallel.stages.0.steps',
          yamlEntityType: 'Stage',
          name: 'Stage 1',
          state: 'success'
        },
        children: [
          {
            type: 'Step',
            config: {
              maxWidth: 200,
              minHeight: 50,
              width: 200,
              hideDeleteButton: false,
              selectable: true
            },
            data: {
              yamlPath: 'pipeline.stages.0.parallel.stages.0.steps.0',
              yamlEntityType: 'Step',
              name: 'npm install',
              icon: <Icon className="size-6" name={'run'} />,
              state: 'error'
            },
            path: 'pipeline.children.1.children.0.children.0',
            containerType: 'leaf'
          },
          {
            type: 'Step',
            config: {
              maxWidth: 200,
              minHeight: 50,
              width: 200,
              hideDeleteButton: false,
              selectable: true
            },
            data: {
              yamlPath: 'pipeline.stages.0.parallel.stages.0.steps.1',
              yamlEntityType: 'Step',
              name: 'npm test',
              icon: <Icon className="size-6" name={'run'} />,
              selected: false,
              state: 'executing'
            },
            path: 'pipeline.children.1.children.0.children.1',
            containerType: 'leaf'
          }
        ],
        path: 'pipeline.children.1.children.0',
        containerType: 'serial'
      },
      {
        type: 'Stage',
        config: {
          minWidth: 200,
          minHeight: 50,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: 'pipeline.stages.0.parallel.stages.1',
          yamlChildrenPath: 'pipeline.stages.0.parallel.stages.1.steps',
          yamlEntityType: 'Stage',
          name: 'Stage 2',
          state: 'executing'
        },
        children: [
          {
            type: 'Step',
            config: {
              maxWidth: 200,
              minHeight: 50,
              width: 200,
              hideDeleteButton: false,
              selectable: true
            },
            data: {
              yamlPath: 'pipeline.stages.0.parallel.stages.1.steps.0',
              yamlEntityType: 'Step',
              name: 'go build',
              icon: <Icon className="size-6" name={'run'} />,
              selected: false,
              state: 'warning',
              warningMessage: 'Timeout'
            },
            path: 'pipeline.children.1.children.1.children.0',
            containerType: 'leaf'
          },
          {
            type: 'Step',
            config: {
              maxWidth: 200,
              minHeight: 50,
              width: 200,
              hideDeleteButton: false,
              selectable: true
            },
            data: {
              yamlPath: 'pipeline.stages.0.parallel.stages.1.steps.1',
              yamlEntityType: 'Step',
              name: 'go test -cover',
              icon: <Icon className="size-6" name={'run'} />,
              selected: false,
              state: 'executing'
            },
            path: 'pipeline.children.1.children.1.children.1',
            containerType: 'leaf'
          }
        ],
        path: 'pipeline.children.1.children.1',
        containerType: 'serial'
      }
    ],
    path: 'pipeline.children.1',
    containerType: 'parallel'
  },
  {
    type: 'Stage',
    config: {
      minWidth: 200,
      minHeight: 50,
      hideDeleteButton: true,
      hideBeforeAdd: true,
      hideAfterAdd: true
    },
    data: {
      yamlPath: 'pipeline.stages.1',
      yamlChildrenPath: 'pipeline.stages.1.steps',
      yamlEntityType: 'Stage',
      name: 'Stage 2',
      state: 'success',
      warningMessage: 'Timeout'
    },
    children: [
      {
        type: 'Step',
        config: {
          maxWidth: 200,
          minHeight: 50,
          width: 200,
          hideDeleteButton: false,
          selectable: true
        },
        data: {
          yamlPath: 'pipeline.stages.1.steps.0',
          yamlEntityType: 'Step',
          name: 'docker',
          icon: <Icon className="size-6" name={'docker'} />,
          selected: false,
          state: 'warning',
          warningMessage: 'Timeout'
        },
        path: 'pipeline.children.2.children.0',
        containerType: 'leaf'
      },
      {
        type: 'Step',
        config: {
          maxWidth: 200,
          minHeight: 50,
          width: 200,
          hideDeleteButton: false,
          selectable: true
        },
        data: {
          yamlPath: 'pipeline.stages.1.steps.1',
          yamlEntityType: 'Step',
          name: 'Step 2',
          icon: <Icon className="size-6" name={'slack'} />,
          selected: false,
          state: 'success'
        },
        path: 'pipeline.children.2.children.1',
        containerType: 'leaf'
      }
    ],
    path: 'pipeline.children.2',
    containerType: 'serial'
  },
  {
    type: 'End',
    config: {
      width: 36,
      height: 36,
      hideDeleteButton: true,
      hideAfterAdd: true,
      hideRightPort: true
    },
    data: {},
    path: 'pipeline.children.3',
    containerType: 'leaf'
  }
]
