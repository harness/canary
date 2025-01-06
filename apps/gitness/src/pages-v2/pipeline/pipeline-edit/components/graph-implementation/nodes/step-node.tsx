import { useMemo } from 'react'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { Button, Icon, Text } from '@harnessio/ui/components'

import { useNodeContext } from '../../../context/NodeContextMenuProvider'
import { CommonNodeDataType } from '../types/nodes'

export interface StepNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: 'success' | 'loading'
  selected?: boolean
}

export function StepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props
  const data = node.data

  const { showContextMenu, selectionPath } = useNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <div
      className={'box-border size-full rounded-xl border bg-primary-foreground p-2'}
      // TODO
      style={{
        border: selected ? '1px solid #999999' : '1px solid #454545',
        background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)'
      }}
    >
      <Button
        className="absolute right-2 top-2"
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

      <div>{data.icon}</div>
      <Text title={data.name} className="m-2 line-clamp-2 cursor-default text-primary">
        {data.name}
      </Text>
    </div>
  )
}
