import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useDragAndDrop from '@hooks/use-drag-and-drop'

import { Card } from './card'
import { IconV2 } from './icon-v2'
import { Layout } from './layout'

interface InfoCardProps {
  id: string
  title: string | React.ReactNode
  description?: string
  children?: React.ReactNode
}
export interface CardData {
  id: string
  title: string | React.ReactNode
  description?: string
  children?: React.ReactNode
}

export const InfoCard = ({ id, title, description, children }: InfoCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 0
      }
    : {}

  return (
    <Card.Root ref={setNodeRef} style={style}>
      <Card.Content>
        <div className="flex items-center gap-2 border-b pb-2 mb-2">
          <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
            <IconV2 name="grip-dots" size="xs" />
          </div>
          {title}
        </div>
        <p className="mt-2">{description}</p>
        {children}
      </Card.Content>
    </Card.Root>
  )
}

export const InfoCardList = ({ cards, setCards }: { cards: CardData[]; setCards: (newCards: CardData[]) => void }) => {
  const { handleDragEnd, getItemId } = useDragAndDrop({
    items: cards,
    onReorder: setCards
  })

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={cards.map((_, index) => getItemId(index))}>
        <Layout.Flex dir="col" gap="md">
          {cards.map((card, index) => (
            <InfoCard key={card.id} id={getItemId(index)} title={card.title} description={card.description}>
              {card.children}
            </InfoCard>
          ))}
        </Layout.Flex>
      </SortableContext>
    </DndContext>
  )
}
