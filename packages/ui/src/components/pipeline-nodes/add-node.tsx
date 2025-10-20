import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'

export interface AddNodeProp {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function AddNode(props: AddNodeProp) {
  const { onClick } = props

  return (
    <div className="border-cn-2 flex size-full items-center justify-center rounded-full border">
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
