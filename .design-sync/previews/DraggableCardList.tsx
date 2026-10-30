import * as React from 'react'
import { DraggableCardList } from '@harnessio/ui'

const initial = [
  { id: 'build', title: 'Build and test', description: 'Compile, run unit tests, publish coverage' },
  { id: 'scan', title: 'Security scan', description: 'SAST and dependency audit on every commit' },
  { id: 'stage', title: 'Deploy to staging', description: 'Rolling update on the staging cluster' },
  { id: 'prod', title: 'Deploy to production', description: 'Canary release with manual approval' }
]

export function PipelineStages() {
  const [cards, setCards] = React.useState(initial)
  return (
    <div style={{ width: 520, padding: 16 }}>
      <DraggableCardList cards={cards} setCards={setCards} />
    </div>
  )
}

export function Contained() {
  const [cards, setCards] = React.useState(initial.slice(0, 3))
  return (
    <div style={{ width: 520, padding: 16 }}>
      <DraggableCardList cards={cards} setCards={setCards} contained listGap="sm" header="Stage order" />
    </div>
  )
}
