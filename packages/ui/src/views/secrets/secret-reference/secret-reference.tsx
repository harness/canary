import { Alert, Button, ButtonGroup, Icon, StackedList } from '@/components'
import { EntityReference, EntityRendererProps } from '@views/platform'
import { DirectionEnum } from '@views/platform/types'

import { SecretItem } from '../types'

export interface SecretReferenceProps {
  // Data
  secretsData: SecretItem[]
  childFolder: string | null
  parentFolder: string | null
  apiError?: string | null

  // State
  selectedEntity: SecretItem | null

  // Callbacks
  onSelectEntity: (entity: SecretItem) => void
  onScopeChange: (direction: DirectionEnum) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Component for selecting existing secrets
export const SecretReference: React.FC<SecretReferenceProps> = ({
  // Data
  secretsData,
  childFolder,
  parentFolder,
  apiError,

  // State
  selectedEntity,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onCancel,
  isLoading
}) => {
  // Define available scopes

  // Custom entity renderer for secrets
  const renderEntity = (props: EntityRendererProps<SecretItem>) => {
    const { entity, isSelected, onSelect } = props

    return (
      <StackedList.Item
        onClick={() => onSelect(entity)}
        className={isSelected ? 'bg-background-4' : ''}
        thumbnail={<Icon name="secrets" size={16} className="text-foreground-5" />}
        actions={
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onSelect(entity)
            }}
          >
            Select
          </Button>
        }
      >
        <StackedList.Field title={entity.secret.name} description={entity.secret.description} />
      </StackedList.Item>
    )
  }

  return (
    <div className="flex flex-col">
      <span className="font-medium mb-4">Select an existing Secret:</span>
      <div className="flex-1">
        <EntityReference<SecretItem>
          entities={secretsData}
          selectedEntity={selectedEntity}
          onSelectEntity={onSelectEntity}
          onScopeChange={onScopeChange}
          renderEntity={renderEntity}
          parentFolder={parentFolder}
          childFolder={childFolder}
          isLoading={isLoading}
        />
        {apiError ? (
          <Alert.Container variant="destructive" className="mt-4">
            <Alert.Description>{apiError}</Alert.Description>
          </Alert.Container>
        ) : null}
      </div>

      <div className="bg-background-2 fixed bottom-0 left-0 right-0 p-4 shadow-md">
        <ButtonGroup className="flex flex-row justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
