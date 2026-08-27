import { Button, IconV2 } from '@harnessio/ui/components'

export interface AddNodeProp {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function AddNode(props: AddNodeProp) {
  const { onClick } = props

  return (
    <div className="border-cn-2 flex size-full items-center justify-center rounded-cn-full border">
      <Button
        iconOnly
        rounded
        className="self-center p-cn-sm"
        style={{ alignSelf: 'center' }}
        variant="outline"
        aria-label="Add node"
        onMouseDown={e => e.stopPropagation()}
        onClick={onClick}
        tooltipProps={{ content: 'Add node' }}
      >
        <IconV2 name="plus" />
      </Button>
    </div>
  )
}
