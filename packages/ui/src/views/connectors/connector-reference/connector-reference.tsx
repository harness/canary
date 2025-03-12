import { Alert, Button, ButtonGroup, Icon, StackedList } from '@/components'
import { EntityReference, EntityRendererProps } from '@views/platform'
import { DirectionEnum } from '@views/platform/types'

// import { ConnectorItem } from '../types'

export interface ConnectorReferenceProps {
  // Data
  connectorsData: any[]
  childFolder: string | null
  parentFolder: string | null
  apiError?: string | null

  // State
  selectedEntity: any | null

  // Callbacks
  onSelectEntity: (entity: any) => void
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
      <span className="font-medium mb-4">Select an existing Connector:</span>
      <div className="flex-1">
        <EntityReference<any>
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
