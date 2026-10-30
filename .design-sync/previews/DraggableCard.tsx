import * as React from 'react'
import { DraggableCard, DraggableCardList, Text } from '@harnessio/ui'

const initial: any[] = [
  { id: 'build', title: <Text variant="body-strong">Build image</Text>, description: <Text color="foreground-3">Compile and push to registry</Text> },
  { id: 'test', title: <Text variant="body-strong">Run tests</Text>, description: <Text color="foreground-3">Unit and integration suites</Text> },
  { id: 'deploy', title: <Text variant="body-strong">Deploy to staging</Text>, description: <Text color="foreground-3">Canary rollout, 10% traffic</Text> }
]

export function List() {
  const [cards, setCards] = React.useState<any[]>(initial)
  return (
    <div style={{ width: 420, padding: 16 }}>
      <DraggableCardList cards={cards} setCards={setCards} />
    </div>
  )
}

export function OutsideGrip() {
  const [cards, setCards] = React.useState<any[]>(initial.map(c => ({ ...c, gripPosition: 'outside' })))
  return (
    <div style={{ width: 420, padding: 16 }}>
      <DraggableCardList cards={cards} setCards={setCards} />
    </div>
  )
}

export function Locked() {
  const [cards, setCards] = React.useState<any[]>(initial.map(c => ({ ...c, disableDragAndDrop: true })))
  return (
    <div style={{ width: 420, padding: 16 }}>
      <DraggableCardList cards={cards} setCards={setCards} />
    </div>
  )
}
