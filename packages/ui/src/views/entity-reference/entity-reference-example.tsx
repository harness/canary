import React, { useState } from 'react'

import { Entity, EntityReference, FileEntity, FolderEntity } from './entity-reference'

// Example data
const exampleEntities: Entity[] = [
  {
    id: 'folder-1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'folder-1-1',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'file-1-1-1',
            name: 'Button.tsx',
            type: 'file',
            extension: 'tsx',
            size: 2048
          },
          {
            id: 'file-1-1-2',
            name: 'Input.tsx',
            type: 'file',
            extension: 'tsx',
            size: 1536
          }
        ]
      },
      {
        id: 'folder-1-2',
        name: 'utils',
        type: 'folder',
        children: [
          {
            id: 'file-1-2-1',
            name: 'helpers.ts',
            type: 'file',
            extension: 'ts',
            size: 768
          }
        ]
      },
      {
        id: 'file-1-3',
        name: 'App.tsx',
        type: 'file',
        extension: 'tsx',
        size: 3072
      }
    ]
  },
  {
    id: 'folder-2',
    name: 'public',
    type: 'folder',
    children: [
      {
        id: 'file-2-1',
        name: 'index.html',
        type: 'file',
        extension: 'html',
        size: 1024
      },
      {
        id: 'file-2-2',
        name: 'favicon.ico',
        type: 'file',
        extension: 'ico',
        size: 512
      }
    ]
  }
]

// Example component showing how to use EntityReference
export const EntityReferenceExample: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

  const handleSelectEntity = (entity: Entity) => {
    setSelectedEntity(entity)
    console.log('Selected entity:', entity)
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Project Files</h2>

      <div className="border rounded border-borders-2 p-4">
        <EntityReference
          entities={exampleEntities}
          selectedEntityId={selectedEntity?.id}
          onSelectEntity={handleSelectEntity}
        />
      </div>
    </div>
  )
}

export default EntityReferenceExample
