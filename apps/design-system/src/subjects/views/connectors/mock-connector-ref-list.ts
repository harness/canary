import { ConnectorReferenceItem } from '@harnessio/ui/views'

export const mockConnectorRefList = [
  {
    name: 'connector-id-1',
    type: 'Pipelines',
    scope: 'project-demo-1',
    createdAt: 1600000000000
  },
  {
    name: 'connector-id-2',
    type: 'Pipelines',
    scope: 'project-demo-2',
    createdAt: 1600100000000
  },
  {
    name: 'connector-id-3',
    type: 'Templates',
    scope: 'project-demo-3',
    createdAt: 1600200000000
  },
  {
    name: 'connector-id-4',
    type: 'Secret',
    scope: 'project-demo-4',
    createdAt: 1600300000000
  },
  {
    name: 'connector-id-5',
    type: 'Service',
    scope: 'project-demo-5',
    createdAt: 1600400000000
  }
] as ConnectorReferenceItem[]
