import { LeafNodeInternalType, ParallelNodeInternalType, SerialNodeInternalType } from '@harnessio/pipeline-graph'
import { cn } from '@harnessio/ui/views'

import { PipelineNodes } from '..'
import { CustomParallelStepGroupContentNodeDataType } from '../../nodes/custom-parallel-step-group-content-node'
import { CustomSerialStepGroupContentNodeDataType } from '../../nodes/custom-serial-step-group-content-node'
import { StepNodeDataType } from '../../nodes/custom-step-node'

export type ExecutionStatusAlign = 'left' | 'right'

export function CollapsedGroupNode({
  node,
  containerNodeType
}: {
  node:
    | ParallelNodeInternalType<CustomParallelStepGroupContentNodeDataType>
    | SerialNodeInternalType<CustomSerialStepGroupContentNodeDataType>
  containerNodeType: 'serial' | 'parallel'
}) {
  const nodesToShow = [...node.children].slice(0, 3)

  if (nodesToShow.length === 0) return null

  const bottomProp = ['-10px', '-20px']
  const opacityProp = ['0.85', '0.7']
  const zIndexProp = ['-1', '-2']

  const firstNode = nodesToShow.shift()

  return (
    <>
      <div
        style={{
          width: firstNode?.config?.minWidth + 'px',
          position: 'relative',
          [containerNodeType === 'parallel' ? 'marginBottom' : 'marginRight']: nodesToShow.length * 10 + 'px'
        }}
      >
        {/* first node with content */}
        <PipelineNodes.StepNode
          // TODO force type cast
          node={firstNode as LeafNodeInternalType<StepNodeDataType>}
          icon={firstNode?.data?.icon}
          name={firstNode?.data?.name}
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
              [containerNodeType === 'parallel' ? 'left' : 'top']: 10 * idx + 10 + 'px',
              [containerNodeType === 'parallel' ? 'right' : 'bottom']: 10 * idx + 10 + 'px',
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
        'card-wrapper': state === 'executing'
      })}
    >
      <div
        role="button"
        tabIndex={0}
        className={cn('box size-full rounded-md border bg-primary-foreground cursor-pointer border-borders-2', {
          'border-success': state === 'success',
          'card-wrapper-warning': state === 'warning',
          'card-wrapper-error': state === 'error'
        })}
      ></div>
    </div>
  )
}
