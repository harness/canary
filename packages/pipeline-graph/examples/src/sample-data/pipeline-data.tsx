import { AnyContainerNodeType } from '../../../src/types/nodes'
import { getIcon } from '../parser/utils'

const config = { minWidth: 140 }

const getChildren = (count: number, state = 'success'): AnyContainerNodeType[] =>
  Array(count)
    .fill(1)
    .map((_, idx) => ({
      type: 'step',
      config: { width: 140, maxWidth: 140 },
      data: { icon: getIcon(idx), state }
    }))

const getPipelineInternal = ({
  parallelChildren,
  serialChildren,
  state
}: {
  parallelChildren: number
  serialChildren: number
  state: 'loading' | 'success'
}): AnyContainerNodeType[] => [
  {
    type: 'start',
    config: {
      width: 60,
      height: 60,
      hideLeftPort: true,
      hideDeleteButton: true
    },
    data: {}
  },
  {
    type: 'step',
    config: { width: 250, height: 250 },
    data: { name: 'VERY LARGE STEP NODE', icon: getIcon(1) }
  },
  { type: 'approval', config: { width: 100, height: 100 }, data: {} },
  { type: 'approval', config: { width: 200, height: 200 }, data: {} },
  { type: 'step', config, data: { icon: getIcon(3), state } },
  {
    type: 'serial',
    children: getChildren(serialChildren, state),
    config: { minWidth: 140, minHeight: 0 },
    data: {}
  },
  {
    type: 'parallel',
    children: [
      {
        type: 'serial',
        children: getChildren(serialChildren),
        config: { minWidth: 140, minHeight: 0 },
        data: {}
      },
      {
        type: 'serial',
        children: getChildren(serialChildren),
        config: { minWidth: 140, minHeight: 0 },
        data: {}
      }
    ],
    config: { minWidth: 140, minHeight: 0 },
    data: {}
  },
  {
    type: 'serial',
    children: [
      {
        type: 'parallel',
        children: getChildren(parallelChildren),
        config: { minWidth: 140, minHeight: 0 },
        data: {}
      },
      {
        type: 'parallel',
        children: [
          {
            type: 'parallel',
            children: getChildren(parallelChildren, state),
            config: { minWidth: 140, minHeight: 0 },
            data: {}
          },
          {
            type: 'step',
            config,
            data: { icon: getIcon(4) }
          }
        ],
        config: { minWidth: 140, minHeight: 0 },
        data: {}
      }
    ],
    config: { minWidth: 140, minHeight: 0 },
    data: {}
  },
  {
    type: 'serial',
    children: [
      {
        type: 'parallel',
        children: [
          {
            type: 'parallel',
            children: getChildren(parallelChildren),
            config: { minWidth: 140, minHeight: 0 },
            data: {}
          },
          {
            type: 'parallel',
            children: getChildren(parallelChildren),
            config: { minWidth: 140, minHeight: 0 },
            data: {}
          }
        ],
        config: { minWidth: 140, minHeight: 0 },
        data: {}
      },
      {
        type: 'parallel',
        children: [
          {
            type: 'parallel',
            children: [
              {
                type: 'parallel',
                children: getChildren(parallelChildren),
                config: { minWidth: 140, minHeight: 0 },
                data: {}
              },
              {
                type: 'parallel',
                children: getChildren(parallelChildren),
                config: { minWidth: 140, minHeight: 0 },
                data: {}
              }
            ],
            config: { minWidth: 140, minHeight: 0 },
            data: {}
          }
        ],
        config: { minWidth: 140, minHeight: 0 },
        data: {}
      }
    ],
    config: { minWidth: 140, minHeight: 0 },
    data: {}
  },
  {
    type: 'parallel',
    children: [
      { type: 'step', config, data: { icon: getIcon(5) } },
      {
        type: 'parallel',
        children: getChildren(parallelChildren),
        config: { minWidth: 140, minHeight: 0 },
        data: {}
      }
    ],
    config: { minWidth: 140, minHeight: 0 },
    data: {}
  },
  { type: 'step', config, data: { icon: getIcon(6) } },
  {
    type: 'end',
    config: {
      width: 160,
      height: 160,
      hideRightPort: true,
      hideDeleteButton: true
    },
    data: {}
  }
]

/** utility for creating pipelines for testing */
export const getPipeline = (repeat = 1, parallel = 5, serial = 3, state: 'loading' | 'success' = 'success') => {
  let largePipelineInternal: AnyContainerNodeType[] = []

  for (let i = 0; i < repeat; i++) {
    largePipelineInternal = [
      ...largePipelineInternal,
      ...getPipelineInternal({
        parallelChildren: parallel,
        serialChildren: serial,
        state
      })
    ]
  }

  return largePipelineInternal
}

export const getExecutionPipeline = () => {
  const largePipelineInternal: AnyContainerNodeType[] = [
    {
      type: 'step',
      config: { ...config, hideLeftPort: true },
      data: { icon: getIcon(6), name: 'Trigger', label: 'Label 1' }
    },
    { type: 'step', config, data: { icon: getIcon(5), name: 'Pipeline start', label: 'Label 2' } },

    {
      type: 'parallel',
      children: [
        { type: 'step', config, data: { icon: getIcon(1), name: 'Shell script', label: 'Label 3' } },

        { type: 'step', config, data: { icon: getIcon(5), name: 'Background', label: 'Label 3' } },
        { type: 'step', config, data: { icon: getIcon(5), name: 'Test', label: 'Label 5' } }
      ],
      config: { minWidth: 140, minHeight: 0, hideLeftPort: true, hideRightPort: true },
      data: {}
    },
    { type: 'step', config: { ...config }, data: { icon: getIcon(4), label: 'Label 6' } },
    {
      type: 'parallel',
      children: [
        { type: 'step', config, data: { icon: getIcon(1) } },

        { type: 'step', config, data: { icon: getIcon(5) } }
      ],
      config: { minWidth: 140, minHeight: 0, hideLeftPort: true, hideRightPort: true },
      data: {}
    },
    { type: 'step', config: { ...config, hideRightPort: true }, data: { icon: getIcon(4) } }
  ]

  return largePipelineInternal
}
