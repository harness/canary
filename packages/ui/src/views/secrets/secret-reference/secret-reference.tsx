import { Button, ButtonGroup, Icon, Spacer, StackedList, Text } from '@/components'
import { EntityReference, EntityRendererProps } from '@views/platform'
import { DirectionEnum } from '@views/platform/types'

import { SecretItem, secretsFilterTypes } from '../types'

export interface SecretReferenceProps {
  // Data
  secretsData: SecretItem[]
  childFolder: string | null
  parentFolder: string | null
  currentFolder: string | null
  apiError?: string | null

  // State
  selectedEntity: SecretItem | null
  showBreadcrumbEllipsis?: boolean

  // Callbacks
  onSelectEntity: (entity: SecretItem) => void
  onScopeChange: (direction: DirectionEnum) => void
  onFilterChange?: (filter: string) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Component for selecting existing secrets
export const SecretReference: React.FC<SecretReferenceProps> = ({
  // Data
  secretsData,
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
  onCancel,
  onFilterChange,
  isLoading
}) => {
  // Custom entity renderer for secrets
  const renderEntity = (props: EntityRendererProps<SecretItem>) => {
    const { entity, isSelected, onSelect } = props

    return (
      <StackedList.Item
        onClick={() => onSelect(entity)}
        className={`h-12 p-3 ${isSelected ? 'bg-cn-background-hover' : ''}`}
        thumbnail={<Icon name="secrets" size={14} className="text-cn-foreground-3 ml-2" />}
      >
        <StackedList.Field title={entity.secret.name} />
      </StackedList.Item>
    )
  }

  return (
    <div className="flex flex-col">
      <Text size={4}>Secrets list</Text>
      <Spacer size={5} />
      <EntityReference<SecretItem>
        entities={secretsData}
        selectedEntity={selectedEntity}
        onSelectEntity={onSelectEntity}
        onScopeChange={onScopeChange}
        renderEntity={renderEntity}
        parentFolder={parentFolder}
        childFolder={childFolder}
        isLoading={isLoading}
        currentFolder={currentFolder}
        apiError={apiError}
        showBreadcrumbEllipsis={showBreadcrumbEllipsis}
        filterTypes={secretsFilterTypes}
        onFilterChange={onFilterChange}
      />

      <div className="absolute inset-x-0 bottom-0 bg-cn-background-2 p-4 shadow-md">
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
