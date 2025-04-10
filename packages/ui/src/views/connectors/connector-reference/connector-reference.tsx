import { Alert, Button, ButtonGroup, Icon, Logo, StackedList } from '@/components'
import { cn } from '@utils/cn'
import { EntityReference, EntityRendererProps } from '@views/platform'
import { DirectionEnum } from '@views/platform/types'

import { ConnectorTypeToLogoNameMap } from '../connectors-list/utils'
import { ConnectorItem, connectorRefFilters } from '../types'

export interface ConnectorReferenceProps {
  // Data
  connectorsData: ConnectorItem[]
  childFolder: string | null
  currentFolder: string | null
  parentFolder: string | null
  apiError?: string | null

  // State
  selectedEntity: ConnectorItem | null
  showBreadcrumbEllipsis?: boolean

  // Callbacks
  onSelectEntity: (entity: ConnectorItem) => void
  onScopeChange: (direction: DirectionEnum) => void
  onFilterChange: (type: string) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Component for selecting existing connectors
export const ConnectorReference: React.FC<ConnectorReferenceProps> = ({
  // Data
  connectorsData,
  childFolder,
  parentFolder,
  currentFolder,
  apiError,

  // State
  selectedEntity,
  showBreadcrumbEllipsis = false,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onFilterChange,
  onCancel,
  isLoading
}) => {
  // Define available scopes

  // Custom entity renderer for connectors
  const renderEntity = (props: EntityRendererProps<any>) => {
    const { entity, isSelected, onSelect } = props
    const connectorLogo = entity.connector.type ? ConnectorTypeToLogoNameMap.get(entity.connector.type) : undefined

    return (
      <StackedList.Item
        onClick={() => onSelect(entity)}
        className={cn('h-12 p-3', { 'bg-cn-background-hover': isSelected })}
        thumbnail={
          connectorLogo ? (
            <Logo name={connectorLogo} size={14} />
          ) : (
            <Icon name="connectors" size={14} className="text-cn-foreground-3" />
          )
        }
      >
        <StackedList.Field title={entity.connector.name} description={entity.connector.description} />
      </StackedList.Item>
    )
  }

  return (
    <div className="flex flex-col">
      <EntityReference<ConnectorItem>
        entities={connectorsData}
        selectedEntity={selectedEntity}
        onSelectEntity={onSelectEntity}
        onScopeChange={onScopeChange}
        renderEntity={renderEntity}
        parentFolder={parentFolder}
        currentFolder={currentFolder}
        childFolder={childFolder}
        isLoading={isLoading}
        showBreadcrumbEllipsis={showBreadcrumbEllipsis}
        filterTypes={connectorRefFilters}
        onFilterChange={onFilterChange}
      />
      {apiError ? (
        <Alert.Container variant="destructive" className="mt-4">
          <Alert.Description>{apiError}</Alert.Description>
        </Alert.Container>
      ) : null}

      <div className="bg-cn-background-2 absolute inset-x-0 bottom-0 p-4 shadow-md">
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
