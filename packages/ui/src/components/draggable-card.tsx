import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useDragAndDrop from '@hooks/use-drag-and-drop'
import { cn } from '@utils/cn'

import { Card, type CardRootProps } from './card'
import { IconV2 } from './icon-v2'
import { Layout } from './layout'

interface DraggableCardProps extends Omit<CardRootProps, 'title' | 'children'> {
  id: string
  title: string | React.ReactNode
  description?: string | React.ReactNode
  disableDragAndDrop?: boolean
}
export interface CardData extends Omit<CardRootProps, 'title' | 'children'> {
  id: string
  name?: string
  title: string | React.ReactNode
  description?: string | React.ReactNode
  disableDragAndDrop?: boolean
}

export const DraggableCard = ({
  id,
  title,
  description,
  disableDragAndDrop = false,
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

  return (
    <Card.Root ref={setNodeRef} style={style} {...cardProps}>
      <Card.Content>
        <div className={cn('-mx-4 px-4', description ? 'border-b' : '')}>
          <div className={cn('flex items-center gap-2', description ? 'pb-4' : '')}>
            {disableDragAndDrop ? null : (
              <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <IconV2 name="grip-dots" size="xs" />
              </div>
            )}
            {title}
          </div>
        </div>
        {description && <div className="mt-4">{description}</div>}
      </Card.Content>
    </Card.Root>
  )
}

export const DraggableCardList = ({
  cards,
  setCards
}: {
  cards: CardData[]
  setCards: (newCards: CardData[]) => void
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
        <Layout.Flex direction="column" gap="md">
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
