import { Icon } from '@harnessio/canary'
import { AnyNodeType, LeafNodeType, ParallelNodeType, SerialNodeType } from '@harnessio/pipeline-graph/dist2'

import { ContentNodeTypes } from '../components/graph-implementation/content-node-types'
import { ParallelGroupNodeDataType } from '../components/graph-implementation/nodes/parallel-group-node'
import { StageNodeContentType } from '../components/graph-implementation/nodes/stage-node'
import { StepNodeDataType } from '../components/graph-implementation/nodes/step-node'

export const yaml2Nodes = (yamlObject: Record<string, any>): AnyNodeType[] => {
  const nodes: AnyNodeType[] = []

  const stages = yamlObject?.pipeline?.stages
  if (stages) {
    const stagesNodes = processStages(stages, '')
    nodes.push(...stagesNodes)
  }

  return nodes
}

const getGroupKey = (stage: Record<string, any>): 'group' | 'parallel' | undefined => {
  if ('group' in stage) return 'group'
  else if ('parallel' in stage) return 'parallel'
  return undefined
}

const processStages = (stages: any[], currentPath: string): AnyNodeType[] => {
  return stages.map((stage, idx) => {
    // parallel stage
    const groupKey = getGroupKey(stage)
    if (groupKey === 'group') {
      const name = stage.name ?? `Serial group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 140, // TMP
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name,
          icon: <span>GR</span> // TMP
        } satisfies StageNodeContentType,

        children: processStages(stage[groupKey].stages, path)
      } satisfies SerialNodeType
    } else if (groupKey === 'parallel') {
      const name = stage.name ?? `Parallel group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 140, // TMP
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name,
          icon: <span>PL</span> // TMP
        } satisfies ParallelGroupNodeDataType,
        children: processStages(stage[groupKey].stages, path)
      } satisfies ParallelNodeType
    }
    // regular stage
    else {
      const name = stage.name ?? `Stage ${idx}`
      const path = `${currentPath}.${idx}`

      return {
        type: ContentNodeTypes.stage,
        config: {
          minWidth: 140, // TMP
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name,
          icon: <span>ST</span> // TMP
        } satisfies StageNodeContentType,
        children: processSteps(stage.steps, path)
      } satisfies SerialNodeType
    }
  })
}

const processSteps = (steps: any[], currentPath: string): AnyNodeType[] => {
  return steps.map((step, idx) => {
    // parallel stage
    const groupKey = getGroupKey(step)
    if (groupKey === 'group') {
      const name = step.name ?? `Step group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 140, // TMP
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name,
          icon: <span>SGR</span> // TMP
        } satisfies StageNodeContentType,

        children: processSteps(step[groupKey].steps, path)
      } satisfies SerialNodeType
    } else if (groupKey === 'parallel') {
      const name = step.name ?? `Parallel group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 140, // TMP
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name,
          icon: <span>SPL</span> // TMP
        } satisfies ParallelGroupNodeDataType,
        children: processSteps(step[groupKey].steps, path)
      } satisfies ParallelNodeType
    }
    // regular step
    else {
      const name = step.name ?? `Step ${idx}`

      const path = `${currentPath}.${idx}`
      return {
        type: ContentNodeTypes.step,
        config: {
          // minWidth: idx === 0 ? 140 : 540, //TMP
          // maxWidth: idx === 0 ? 140 : 540, //TMP
          //   width: idx === 0 ? 140 : 540, //TMP
          //   height: idx === 1 ? undefined : 240, //TMP
          maxWidth: 160, //TMP
          width: 160, //TMP
          hideDeleteButton: false
        },
        data: {
          yamlPath: path,
          name,
          icon: getIcon(idx)
        } satisfies StepNodeDataType
      } satisfies LeafNodeType
    }
  })
}

export function getIcon(idx: number) {
  return (
    <div style={{ margin: '10px' }}>
      {idx % 2 ? (
        <Icon name="harness-plugin" className="size-8" />
      ) : (
        // <HarnessStep width="30" height="30" style={{ color: '#00ADE4' }} />
        <Icon name="run" className="size-8" />
        // <RunStep width="30" height="30" style={{ color: '#CCC' }} />
      )}
    </div>
  )
}
