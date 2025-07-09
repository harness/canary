import { LeafContainerNodeType, ParallelContainerNodeType } from '../../../src'
import { getIcon } from '../parser/utils'

export const taData = [
  {
    type: 'parallel',
    config: {
      hideDeleteButton: false,
      hideCollapseButton: false,
      hideLeftPort: true,
      minWidth: 180
    },
    data: {
      yamlPath: '.0',
      name: 'Stage 0'
    },
    children: [
      {
        type: 'step',
        config: {
          maxWidth: 140,
          hideDeleteButton: false,
          selectable: true,
          hideLeftPort: true,
          hideRightPort: true
        },
        data: {
          yamlPath: '.0.0',
          name: 'Step 0',
          icon: getIcon(1)
        }
      } satisfies LeafContainerNodeType,
      {
        type: 'step',
        config: {
          maxWidth: 140,
          hideDeleteButton: false,
          selectable: true,
          hideLeftPort: true,
          hideRightPort: true
        },
        data: {
          yamlPath: '.0.1',
          name: 'Step 1',
          icon: getIcon(1)
        }
      } satisfies LeafContainerNodeType
    ]
  } satisfies ParallelContainerNodeType,

  {
    type: 'parallel',
    config: {
      hideDeleteButton: false,
      hideCollapseButton: false,
      minWidth: 180
    },
    data: {
      yamlPath: '.1',
      name: 'Stage 1'
    },
    children: [
      {
        type: 'step',
        config: {
          maxWidth: 140,
          hideDeleteButton: false,
          selectable: true,
          hideLeftPort: true,
          hideRightPort: true
        },
        data: {
          yamlPath: '.1.0',
          name: 'Step 0',
          icon: getIcon(1)
        }
      } satisfies LeafContainerNodeType,
      {
        type: 'step',
        config: {
          maxWidth: 140,
          hideDeleteButton: false,
          selectable: true,
          hideLeftPort: true,
          hideRightPort: true
        },
        data: {
          yamlPath: '.1.1',
          name: 'Step 1',
          icon: getIcon(1)
        }
      } satisfies LeafContainerNodeType,
      {
        type: 'step',
        config: {
          maxWidth: 140,
          hideDeleteButton: false,
          selectable: true,
          hideLeftPort: true,
          hideRightPort: true
        },
        data: {
          yamlPath: '.1.2',
          name: 'Step 2',
          icon: getIcon(1)
        }
      } satisfies LeafContainerNodeType
    ]
  } satisfies ParallelContainerNodeType,
  {
    type: 'parallel',
    config: {
      hideDeleteButton: false,
      hideCollapseButton: false,
      hideRightPort: true,
      minWidth: 180
    },
    data: {
      yamlPath: '.2',
      name: 'Stage 2'
    },
    children: [
      {
        type: 'step',
        config: {
          maxWidth: 140,
          hideDeleteButton: false,
          selectable: true,
          hideLeftPort: true,
          hideRightPort: true
        },
        data: {
          yamlPath: '.2.0',
          name: 'Step 0',
          icon: getIcon(1)
        }
      } satisfies LeafContainerNodeType
    ]
  } satisfies ParallelContainerNodeType
]
