import { useState } from 'react'

import {
  Accordion,
  CardData,
  Checkbox,
  DraggableCardList,
  Drawer,
  IconV2,
  MoreActionsTooltip,
  Select
} from '@harnessio/ui/components'

export const DraggableCardsDemo = () => {
  // Sample card data
  const [cards, setCards] = useState<CardData[]>([
    {
      id: '1',
      title: (
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center">
            <IconV2 name="ai" size="md" />
            <span className="ml-2">First Card</span>
          </span>
          <MoreActionsTooltip
            actions={[
              {
                title: 'Action 1',
                onClick: () => {}
              },
              {
                title: 'Action 2',
                onClick: () => {}
              }
            ]}
            iconName="more-horizontal"
          />
        </div>
      ),
      description: (
        <div>
          <Select
            options={[
              { label: 'AWS', value: 'aws' },
              { label: 'GCP', value: 'gcp' },
              { label: 'Azure', value: 'azure' },
              { label: 'Kubernetes', value: 'k8s' }
            ]}
            placeholder="Select infrastructure"
            onChange={() => {}}
            label="Infrastructure Settings"
          />

          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="advanced">
              <Accordion.Trigger>Advanced Settings</Accordion.Trigger>
              <Accordion.Content>
                <Checkbox id="enable-monitoring" label="Enable monitoring" />
                <Checkbox id="auto-scaling" label="Enable auto-scaling" />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      )
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
    <Drawer.Root>
      <Drawer.Trigger>Open</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Environment</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <DraggableCardList cards={cards} setCards={setCards} />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export default DraggableCardsDemo
