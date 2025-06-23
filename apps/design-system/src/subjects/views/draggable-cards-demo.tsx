import { useState } from 'react'

import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Card, IconV2 } from '@harnessio/ui/components'

interface CardData {
  id: string
  title: string
  description: string
}

interface SortableCardProps {
  id: string
  title: string
  description: string
}

const SortableCard = ({ id, title, description }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative border rounded-md shadow-sm ${isDragging ? 'z-10' : ''}`}
    >
      <Card.Root>
        <Card.Content>
          <div className="flex items-center gap-2">
            <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
              <IconV2 className="size-4 text-gray-400" name="grip-dots" size="xs" />
            </div>
            <Card.Title>{title}</Card.Title>
          </div>
          <p className="mt-2">{description}</p>
        </Card.Content>
      </Card.Root>
    </div>
  )
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

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) return
    
    const oldIndex = cards.findIndex(card => card.id === active.id)
    const newIndex = cards.findIndex(card => card.id === over.id)
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newCards = [...cards]
      const [movedCard] = newCards.splice(oldIndex, 1)
      newCards.splice(newIndex, 0, movedCard)
      setCards(newCards)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Draggable Cards Demo</h2>
      <p className="mb-4 text-gray-600">Drag and drop the cards below to reorder them</p>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={cards.map(card => card.id)}>
          <div className="flex flex-col gap-4">
            {cards.map(card => (
              <SortableCard 
                key={card.id} 
                id={card.id} 
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
