import { Icon } from '@harnessio/canary'
import React from 'react'

const mockOverviewData = [
  {
    title: 'Fgarson created a doodah',
    description: 'Description for doodah 1',
    icon: <Icon name="unmerged" size={16} />
  },
  {
    title: 'Another event',
    description: 'Description for event 2',
    icon: <Icon name="unmerged" size={16} className="text-primary" />
  },
  {
    title: 'Something else happened',
    description: 'Description for event 3',
    icon: <Icon name="merged" size={16} />
  },
  { title: 'Yet another action', description: 'Description for event 4', icon: <Icon name="pipelines" size={16} /> },
  { title: 'Final event', description: 'Description for event 5', icon: <Icon name="success" size={16} /> }
]

export default mockOverviewData
