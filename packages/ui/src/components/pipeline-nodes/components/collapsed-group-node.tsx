import { cn } from '@utils/cn'
import { getNestedStepsCount } from '@views/unified-pipeline-studio/components/graph-implementation/utils/common-step-utils'

import {
  ParallelNodeInternalType,
  SerialNodeInternalType,
  type ParallelContainerConfigType,
  type SerialContainerConfigType
} from '@harnessio/pipeline-graph'

import { PipelineNodes } from '..'

export function CollapsedGroupNode({
  node,
  containerNodeType,
  parallelContainerConfig,
  serialContainerConfig
}: {
  node: ParallelNodeInternalType | SerialNodeInternalType
  containerNodeType: 'serial' | 'parallel'
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  serialContainerConfig?: Partial<SerialContainerConfigType>
}) {
  const nodesToShow = [...node.children].slice(0, 3)

  if (nodesToShow.length === 0) return null

  const bottomProp = ['-8px', '-16px']
  const opacityProp = ['0.6', '0.35']
  const zIndexProp = ['-1', '-2']

  const firstNode = nodesToShow.shift()
  const counter =
    !!firstNode && 'children' in firstNode && Array.isArray(firstNode.children)
      ? getNestedStepsCount(firstNode?.children)
      : undefined

  const w = node.config?.width ? node.config?.width + 'px' : 'auto'
  const minW = node.config?.minWidth ? node.config?.minWidth + 'px' : 'auto'

  return (
    <>
      <div
        style={{
          width: w,
          minWidth: minW,
          position: 'relative',
          [containerNodeType === 'parallel' ? 'marginBottom' : 'marginRight']: nodesToShow.length * 10 + 'px'
        }}
      >
        {/* first node with content */}
        <PipelineNodes.StepNode
          // TODO force type cast
          executionStatus={firstNode?.data.executionStatus}
          icon={firstNode?.data?.icon}
          name={firstNode?.data?.name}
          counter={counter}
          isCollapsedNode
          parallelContainerConfig={parallelContainerConfig}
          serialContainerConfig={serialContainerConfig}
        />

        {/* other nodes without content*/}
        {nodesToShow.map((childNode, idx) => (
          <div
            key={childNode.path}
            style={{
              position: 'absolute',
              [containerNodeType === 'parallel' ? 'bottom' : 'right']: bottomProp[idx],
              zIndex: zIndexProp[idx],
              opacity: opacityProp[idx],
              [containerNodeType === 'parallel' ? 'left' : 'top']: 5 * idx + 5 + 'px',
              [containerNodeType === 'parallel' ? 'right' : 'bottom']: 5 * idx + 5 + 'px',
              [containerNodeType === 'parallel' ? 'height' : 'width']: '100%'
            }}
          >
            <StackedNode state={childNode.data.state} />
          </div>
        ))}
      </div>
    </>
  )
}

function StackedNode({ state }: { state: string }) {
  return (
    <div
      className={cn('h-full', {
        'unified-pipeline-studio_card-wrapper': state === 'executing'
      })}
    >
      <div
        role="button"
        tabIndex={0}
        className={cn('box size-full rounded-md border bg-cn-3 cursor-pointer shadow-4', {
          'border-cn-success': state === 'success',
          'border-cn-warning': state === 'warning',
          'border-cn-danger': state === 'error'
        })}
      ></div>
    </div>
  )
}
