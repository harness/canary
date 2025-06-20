import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'

export interface AddNodeProp {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function AddNode(props: AddNodeProp) {
  const { onClick } = props

  return (
    <div className="border-border-2 flex size-full items-center justify-center rounded-full border">
      <Button
        className="self-center p-3"
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
