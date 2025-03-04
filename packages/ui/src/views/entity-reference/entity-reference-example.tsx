import React, { useState } from 'react'

import { Icon, Button } from '@/components'

import { BaseEntityProps, EntityReference, EntityRendererProps, ScopeType } from './entity-reference'

// Define our specific entity types based on the provided data structure
interface SecretSpec {
  secretManagerIdentifier: string
  valueType: string
  value: string | null
  additionalMetadata: any | null
}

interface SecretData extends BaseEntityProps {
  type: string
  name: string
  identifier: string
  orgIdentifier: string
  projectIdentifier?: string
  tags: Record<string, string>
  description: string
  spec: SecretSpec
}

interface SecretItem extends BaseEntityProps {
  secret: SecretData
  createdAt: number
  updatedAt: number
  draft: boolean
  governanceMetadata: any | null
  scope?: ScopeType
}

// Example data for Account scope
const accountSecrets: SecretItem[] = [
  {
    id: 'aws-access-key',
    name: 'aws-access-key',
    secret: {
      type: 'SecretText',
      name: 'aws-access-key',
      identifier: 'aws-access-key',
      orgIdentifier: 'default',
      tags: {},
      description: 'AWS access key for deployments',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1710968557986,
    updatedAt: 1710968557986,
    draft: false,
    governanceMetadata: null,
    scope: 'account'
  },
  {
    id: 'github-token',
    name: 'github-token',
    secret: {
      type: 'SecretText',
      name: 'github-token',
      identifier: 'github-token',
      orgIdentifier: 'default',
      tags: {},
      description: 'GitHub token for CI/CD',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1719353653579,
    updatedAt: 1719353653579,
    draft: false,
    governanceMetadata: null,
    scope: 'account'
  }
]

// Example data for Organization scope
const organizationSecrets: SecretItem[] = [
  {
    id: 'hello',
    name: 'hello',
    secret: {
      type: 'SecretText',
      name: 'hello',
      identifier: 'hello',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1741108966918,
    updatedAt: 1741108966918,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  },
  {
    id: 'sanskar-test',
    name: 'sanskar-test',
    secret: {
      type: 'SecretText',
      name: 'sanskar-test',
      identifier: 'sanskar-test',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {
        tag1: '',
        tag2: '',
        tag3: ''
      },
      description: 'desc',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1740785306341,
    updatedAt: 1740785306341,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  },
  {
    id: 'abhinavrastogi-harness',
    name: 'abhinavrastogi-harness',
    secret: {
      type: 'SecretText',
      name: 'abhinavrastogi-harness',
      identifier: 'abhinavrastogi-harness',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: 'github pat',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1719353653579,
    updatedAt: 1719353653579,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  },
  {
    id: 'abhinav-test',
    name: 'abhinav-test',
    secret: {
      type: 'SecretText',
      name: 'abhinav-test',
      identifier: 'abhinavtest',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1700005592914,
    updatedAt: 1700005592914,
    draft: false,
    governanceMetadata: null,
    scope: 'organization'
  }
]

// Format date for display
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Example component showing how to use EntityReference
export const EntityReferenceExample: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<SecretItem | null>(null)
  const [activeScope, setActiveScope] = useState<ScopeType>('account')

  const handleSelectEntity = (entity: SecretItem) => {
    setSelectedEntity(entity)
    console.log('Selected entity:', entity)
  }

  const handleScopeChange = (scope: ScopeType) => {
    setActiveScope(scope)
    console.log('Scope changed to:', scope)
  }

  // Get entities based on active scope
  const getEntitiesByScope = () => {
    switch (activeScope) {
      case 'account':
        return accountSecrets
      case 'organization':
        return organizationSecrets
      default:
        return []
    }
  }

  // Custom entity renderer for secrets
  const renderEntity = (props: EntityRendererProps<SecretItem>) => {
    const { entity, isSelected, onSelect } = props
    
    return (
      <div
        className={`flex items-center py-2 px-3 rounded cursor-pointer hover:bg-background-3 transition-colors ${
          isSelected ? 'bg-background-4' : ''
        }`}
        onClick={() => onSelect(entity)}
      >
        <div className="flex-1 flex items-center">
          <Icon name="secrets" className="mr-3 text-foreground-5" size={16} />
          <div className="flex flex-col">
            <span className="font-medium">{entity.secret.name}</span>
            {entity.secret.description && (
              <span className="text-xs text-foreground-5">{entity.secret.description}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs text-foreground-4 mr-4">Updated {formatDate(entity.updatedAt)}</span>
          <Button 
            variant="default" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(entity)
            }}
          >
            Select
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Select an existing Secret:</h2>

      <EntityReference<SecretItem>
        entities={getEntitiesByScope()}
        selectedEntityId={selectedEntity?.id}
        onSelectEntity={handleSelectEntity}
        onScopeChange={handleScopeChange}
        activeScope={activeScope}
        renderEntity={renderEntity}
        onCancel={() => console.log('Cancelled')}
      />
    </div>
  )
}

export default EntityReferenceExample
