import { Button } from '@harnessio/ui/components'
import { IconV2 } from '@harnessio/ui/components'

export interface AddNodeProp {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function AddNode(props: AddNodeProp) {
  const { onClick } = props

  return (
    <div className="border-cn-2 flex size-full items-center justify-center rounded-cn-full border">
      {/* eslint-disable-next-line no-restricted-syntax -- Approved round icon button: Pipelines nodes are a sanctioned special use case (product-design approved), exempt from the rounded deprecation. */}
      <Button
        className="self-center p-cn-sm"
        rounded
        style={{ alignSelf: 'center' }}
        variant="outline"
        onMouseDown={e => e.stopPropagation()}
        onClick={onClick}
      >
        <IconV2 name="plus" />
      </Button>
    </div>
  )
}
