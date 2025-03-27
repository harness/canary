import { Alert, Button, ButtonGroup, Icon, StackedList } from '@/components'
import { EntityReference, EntityRendererProps } from '@views/platform'
import { DirectionEnum } from '@views/platform/types'

import { ConnectorItem } from '../types'

export interface ConnectorReferenceProps {
  // Data
  connectorsData: ConnectorItem[]
  childFolder: string | null
  parentFolder: string | null
  apiError?: string | null

  // State
  selectedEntity: ConnectorItem | null

  // Callbacks
  onSelectEntity: (entity: ConnectorItem) => void
  onScopeChange: (direction: DirectionEnum) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Component for selecting existing connectors
export const ConnectorReference: React.FC<ConnectorReferenceProps> = ({
  // Data
  connectorsData,
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

  // Custom entity renderer for connectors
  const renderEntity = (props: EntityRendererProps<any>) => {
    const { entity, isSelected, onSelect } = props

    return (
      <StackedList.Item
        onClick={() => onSelect(entity)}
        className={isSelected ? 'bg-background-4' : ''}
        thumbnail={<Icon name="connectors" size={16} className="text-foreground-5" />}
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
        <StackedList.Field title={entity.connector.name} description={entity.connector.description} />
      </StackedList.Item>
    )
  }

  return (
    <div className="flex flex-col">
      <span className="mb-4 font-medium">Select an existing Connector:</span>
      <div className="flex-1">
        <EntityReference<ConnectorItem>
          entities={connectorsData}
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

      <div className="fixed inset-x-0 bottom-0 bg-background-2 p-4 shadow-md">
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
