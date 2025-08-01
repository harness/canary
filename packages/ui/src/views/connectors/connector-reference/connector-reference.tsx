import { FC } from 'react'

import { Alert, Button, ButtonLayout, IconV2, LogoV2, StackedList } from '@/components'
import { ConnectorItem, connectorRefFilters, DirectionEnum, EntityReference, EntityRendererProps } from '@/views'
import { cn } from '@utils/cn'

import { ConnectorTypeToLogoNameMap } from '../connectors-list/utils'

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

  // Search
  searchValue?: string
  handleChangeSearchValue: (val: string) => void

  isDrawer?: boolean
}

// Component for selecting existing connectors
export const ConnectorReference: FC<ConnectorReferenceProps> = ({
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
  isLoading,

  // search
  searchValue,
  handleChangeSearchValue,

  isDrawer = false
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
            <LogoV2 name={connectorLogo} size="sm" />
          ) : (
            <IconV2 name="connectors" size="xs" className="text-cn-foreground-3" />
          )
        }
      >
        <div title={entity.connector.name}>
          <StackedList.Field
            title={entity.connector.name}
            description={entity.connector.description}
            className="max-w-sm overflow-hidden truncate text-nowrap"
          />
        </div>
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
        searchValue={searchValue}
        handleChangeSearchValue={handleChangeSearchValue}
      />
      {!!apiError && (
        <Alert.Root theme="danger" className="mt-4">
          <Alert.Description>{apiError}</Alert.Description>
        </Alert.Root>
      )}
      {!isDrawer && (
        <ButtonLayout.Root>
          <ButtonLayout.Primary>
            <Button type="submit">Save</Button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </ButtonLayout.Secondary>
        </ButtonLayout.Root>
      )}
    </div>
  )
}
