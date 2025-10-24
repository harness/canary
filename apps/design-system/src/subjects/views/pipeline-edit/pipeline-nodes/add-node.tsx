import { Button, Icon } from '@harnessio/ui/components'

export interface AddNodeProp {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function AddNode(props: AddNodeProp) {
  const { onClick } = props

  return (
    <div className="border-border-2 bg-primary-foreground flex size-full items-center justify-center rounded-full border">
      <Button
        className="self-center rounded-full p-3"
        style={{ alignSelf: 'center' }}
        variant="outline"
        size="lg"
        onMouseDown={e => e.stopPropagation()}
        onClick={onClick}
      >
        <Icon name="plus" size={15} />
      </Button>
    </div>
  )
}
