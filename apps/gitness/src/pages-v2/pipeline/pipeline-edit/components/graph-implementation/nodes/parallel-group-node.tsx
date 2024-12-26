import { ParallelNodeInternalType } from '@harnessio/pipeline-graph'
import { Button, Icon } from '@harnessio/ui/components'

import { useNodeContext } from '../../../context/NodeContextMenuProvider'
import { CommonNodeDataType } from '../types/nodes'

export interface ParallelGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function ParallelGroupContentNode(props: {
  node: ParallelNodeInternalType<ParallelGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
}) {
  const { node, children, collapsed } = props
  const data = node.data as ParallelGroupContentNodeDataType

  const { showContextMenu, handleAddIn } = useNodeContext()

  return (
    <>
      <div
        className="absolute inset-0 -z-10 rounded-xl "
        // TODO
        style={{
          border: '1px dashed #454545',
          background: 'rgba(152, 150, 172, 0.01)'
        }}
      />

      <div className="absolute inset-x-0 top-0 h-0">
        {/* //flex h-9 items-center */}
        <div title={data.name} className="m-3 h-9 cursor-default truncate px-8 pt-2.5 text-primary-muted">
          {data.name}
        </div>
      </div>

      <Button
        className="absolute right-2 top-2 z-10"
        variant="ghost"
        size="sm_icon"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          showContextMenu(data, e.currentTarget)
        }}
      >
        <Icon name="ellipsis" size={15} />
      </Button>

      {!collapsed && node.children.length === 0 && (
        <Button
          className="self-center rounded-full p-3"
          variant="outline"
          size="lg"
          onMouseDown={e => e.stopPropagation()}
          onClick={e => {
            handleAddIn(data, e.currentTarget)
          }}
        >
          <Icon name="plus" size={15} />
        </Button>
      )}

      {children}
    </>
  )
}
