import cx from 'clsx'

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

  const { showContextMenu } = useNodeContext()

  return (
    <div
      className={cx('box-border size-full rounded-xl border bg-primary-foreground p-2', {
        // 'border-borders-3': data.selected,
        // 'border-borders-6': !data.selected
      })}
      // TODO
      style={{
        border: '1px solid #454545',
        background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)'
      }}
    >
      <Button
        className="absolute right-2 top-2"
        variant="ghost"
        size="sm_icon"
        onClick={e => {
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
