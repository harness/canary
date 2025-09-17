import { Button, ButtonLayout, EntityFormLayout, Spacer, StackedList } from '@/components'
import { cn } from '@/utils'
import { DirectionEnum, EntityReference, EntityRendererProps, SecretItem, secretsFilterTypes } from '@/views'

export interface SecretReferenceProps {
  // Data
  secretsData: SecretItem[]
  childFolder: string | null
  parentFolder: string | null
  currentFolder: string | null

  // State
  selectedEntity: SecretItem | null
  showBreadcrumbEllipsis?: boolean

  // Callbacks
  onSelectEntity: (entity: SecretItem) => void
  onScopeChange: (direction: DirectionEnum) => void
  onFilterChange?: (filter: string) => void
  onCancel?: () => void
  isLoading?: boolean

  // Search
  searchValue?: string
  handleChangeSearchValue: (val: string) => void

  isDrawer?: boolean
}

// Component for selecting existing secrets
export const SecretReference: React.FC<SecretReferenceProps> = ({
  // Data
  secretsData,
  childFolder,
  parentFolder,
  currentFolder,

  // State
  selectedEntity,
  showBreadcrumbEllipsis = false,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onCancel,
  onFilterChange,
  isLoading,

  // search
  searchValue,
  handleChangeSearchValue,

  isDrawer = false
}) => {
  // Custom entity renderer for secrets
  const renderEntity = (props: EntityRendererProps<SecretItem>) => {
    const { entity, isSelected, onSelect } = props

    return (
      <StackedList.Item
        className={cn({ 'bg-cn-hover': isSelected })}
        paddingY="sm"
        onClick={() => onSelect(entity)}
        // thumbnail={<IconV2 name="lock" size="xs" className="ml-2 text-cn-3" />}
      >
        <StackedList.Field title={entity.secret.name} />
      </StackedList.Item>
    )
  }

  return (
    <div className="flex flex-col">
      <EntityFormLayout.Title>Secrets list</EntityFormLayout.Title>
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
        showBreadcrumbEllipsis={showBreadcrumbEllipsis}
        filterTypes={secretsFilterTypes}
        onFilterChange={onFilterChange}
        searchValue={searchValue}
        handleChangeSearchValue={handleChangeSearchValue}
      />

      {!isDrawer && (
        <ButtonLayout horizontalAlign="start">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </ButtonLayout>
      )}
    </div>
  )
}
