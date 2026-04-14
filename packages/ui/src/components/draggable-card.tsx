import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useDragAndDrop from '@hooks/use-drag-and-drop'
import { cn } from '@utils/cn'

import { Card, type CardRootProps } from './card'
import { IconV2 } from './icon-v2'
import { Layout, type GapSize } from './layout'

interface DraggableCardProps extends Omit<CardRootProps, 'title' | 'children'> {
  id: string
  title: string | React.ReactNode
  description?: string | React.ReactNode
  disableDragAndDrop?: boolean
  gripPosition?: 'inside' | 'outside'
}
export interface CardData extends Omit<CardRootProps, 'title' | 'children'> {
  id: string
  name?: string
  title: string | React.ReactNode
  description?: string | React.ReactNode
  disableDragAndDrop?: boolean
  gripPosition?: 'inside' | 'outside'
}

export const DraggableCard = ({
  id,
  title,
  description,
  disableDragAndDrop = false,
  gripPosition = 'inside',
  className,
  ...cardProps
}: DraggableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: disableDragAndDrop
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 0
      }
    : {}

  const gripInteractive = !disableDragAndDrop
  const showGrip = gripPosition === 'outside' || gripInteractive
  const grip = showGrip ? (
    <div
      className={cn(
        'flex size-[18px] shrink-0 items-center justify-center',
        gripInteractive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      )}
      {...(gripInteractive ? { ...attributes, ...listeners } : {})}
    >
      <IconV2 name="grip-dots" size="xs" color={gripInteractive ? 'inherit' : 'neutral'} />
    </div>
  ) : null

  const cardBody = (
    <>
      <div
        className={cn(
          'w-full min-w-0',
          gripPosition === 'outside'
            ? cn(description && 'border-b')
            : cn('-mx-cn-md px-cn-md', description && 'border-b')
        )}
      >
        <div
          className={cn(
            'flex w-full min-w-0 items-center gap-cn-xs',
            description && gripPosition === 'inside' && 'pb-cn-md'
          )}
        >
          {gripPosition === 'inside' ? grip : null}
          {title}
        </div>
      </div>
      {description && <div className="mt-cn-md">{description}</div>}
    </>
  )

  if (gripPosition === 'outside') {
    return (
      <div ref={setNodeRef} style={style} className="flex w-full min-w-0 items-center gap-cn-xs">
        {grip}
        <Card.Root className={cn('min-w-0 w-full flex-1', className)} {...cardProps}>
          <Card.Content className="min-w-0 w-full">{cardBody}</Card.Content>
        </Card.Root>
      </div>
    )
  }

  return (
    <Card.Root ref={setNodeRef} style={style} className={cn('w-full min-w-0', className)} {...cardProps}>
      <Card.Content className="min-w-0 w-full">{cardBody}</Card.Content>
    </Card.Root>
  )
}

export const DraggableCardList = ({
  cards,
  setCards,
  listGap = 'md',
  className
}: {
  cards: CardData[]
  setCards: (newCards: CardData[]) => void
  listGap?: GapSize
  className?: string
}) => {
  const { handleDragEnd, getItemId } = useDragAndDrop({
    items: cards,
    onReorder: setCards
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Add a small delay to allow clicks to be processed before starting drag
      activationConstraint: {
        delay: 100,
        tolerance: 0
      }
    })
  )

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={cards.map((_, index) => getItemId(index))}>
        <Layout.Flex direction="column" gap={listGap} className={cn('w-full min-w-0', className)}>
          {cards.map((card, index) => (
            <DraggableCard
              key={card.id}
              description={card.description}
              disableDragAndDrop={card.disableDragAndDrop}
              {...card}
              id={getItemId(index)}
            />
          ))}
        </Layout.Flex>
      </SortableContext>
    </DndContext>
  )
}
