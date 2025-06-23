import { useState } from 'react'

import { CardData, InfoCardList } from '@harnessio/ui/components'

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Draggable Cards Demo</h2>
      <p className="mb-4 text-gray-600">Drag and drop the cards below to reorder them</p>
      <InfoCardList cards={cards} setCards={setCards} />
    </div>
  )
}

export default DraggableCardsDemo
