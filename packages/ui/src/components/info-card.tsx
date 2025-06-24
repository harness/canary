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
  description?: string | React.ReactNode
  disabled?: boolean
}
export interface CardData {
  id: string
  title: string | React.ReactNode
  description?: string | React.ReactNode
  disabled?: boolean
}

export const InfoCard = ({ id, title, description, disabled = false }: InfoCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 0
      }
    : {}

  return (
    <Card.Root ref={setNodeRef} style={style}>
      <Card.Content>
        <div className="-mx-4 px-4 border-b">
          <div className="pb-4 flex items-center gap-2">
            {disabled ? null : (
              <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <IconV2 name="grip-dots" size="xs" />
              </div>
            )}
            {title}
          </div>
        </div>
        <div className="mt-4">{description}</div>
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
        <Layout.Flex direction="column" gap="md">
          {cards.map((card, index) => (
            <InfoCard
              key={card.id}
              id={getItemId(index)}
              title={card.title}
              description={card.description}
              disabled={card.disabled}
            />
          ))}
        </Layout.Flex>
      </SortableContext>
    </DndContext>
  )
}
