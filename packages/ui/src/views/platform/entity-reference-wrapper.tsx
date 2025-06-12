import { EntityFormLayout, Icon, IconNameMap, Layout, Spacer, StackedList } from '@/components'
import { BaseEntityProps, EntityReference, EntityReferenceProps, EntityRendererProps } from '@/views'

export interface EntityReferenceStackProps<ReferenceItem extends BaseEntityProps>
  extends Omit<EntityReferenceProps<ReferenceItem>, 'renderEntity'> {
  icon: keyof typeof IconNameMap
  title: string
}

export const EntityReferenceWrapper = <ReferenceItem extends BaseEntityProps>(
  props: EntityReferenceStackProps<ReferenceItem>
) => {
  const renderEntity = (entityRendererProps: EntityRendererProps<ReferenceItem>) => {
    const { entity, isSelected, onSelect } = entityRendererProps

    return (
      <StackedList.Item
        onClick={() => onSelect(entity)}
        className={`h-12 p-3 ${isSelected ? 'bg-cn-background-hover' : ''}`}
        thumbnail={<Icon name={props.icon} size={14} className="ml-2 text-cn-foreground-3" />}
      >
        <StackedList.Field title={entity.name} />
      </StackedList.Item>
    )
  }

  return (
    <Layout.Vertical>
      <EntityFormLayout.Title>{props.title}</EntityFormLayout.Title>
      <Spacer size={5} />
      <EntityReference<ReferenceItem> renderEntity={renderEntity} {...props} />
    </Layout.Vertical>
  )
}
