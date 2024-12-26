import { Icon } from '@harnessio/canary'
import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { Button } from '@harnessio/ui/components'

import { useNodeContext } from '../../../context/NodeContextMenuProvider'
import { CommonNodeDataType } from '../types/nodes'

export interface AddNodeDataType extends CommonNodeDataType {}

export function AddNode(props: { node: LeafNodeInternalType<AddNodeDataType> }) {
  const { node } = props
  const { data } = node

  const { handleAddIn } = useNodeContext()

  return (
    <div
      className="flex size-full items-center justify-center rounded-full border border-borders-6 bg-primary-foreground"
      //  TODO
      style={{
        border: '1px solid #454545',
        background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)'
      }}
    >
      <Button
        className="self-center rounded-full p-3"
        style={{ alignSelf: 'center' }}
        variant="outline"
        size="lg"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => {
          handleAddIn(data, e.currentTarget)
        }}
      >
        <Icon name="plus" size={15} />
      </Button>
    </div>
  )
}
