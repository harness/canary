import { useState } from 'react'

import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import { DraggableInfoCard } from '@harnessio/ui/components'
import { useDragAndDrop } from '@harnessio/ui/hooks'

interface CardData {
  id: string
  title: string
  description: string
}

export const DraggableCardsDemo = () => {
  // Sample card data
  const [cards, setCards] = useState<CardData[]>([
    {
      id: '1',
      title: 'First Card',
      description: 'This is the first card. You can drag it around.'
    },
    {
      id: '2',
      title: 'Second Card',
      description: 'This is the second card. Try reordering it.'
    },
    {
      id: '3',
      title: 'Third Card',
      description: 'This is the third card. Drag and drop to reorder.'
    }
  ])

  // Use the drag and drop hook
  const { handleDragEnd, getItemId } = useDragAndDrop.default<CardData>({
    items: cards,
    onReorder: setCards
  })

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Draggable Cards Demo</h2>
      <p className="mb-4 text-gray-600">Drag and drop the cards below to reorder them</p>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={cards.map((_, index) => getItemId(index))}>
          <div className="grid gap-4">
            {cards.map((card, index) => (
              <DraggableInfoCard
                key={card.id}
                id={getItemId(index)}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default DraggableCardsDemo
