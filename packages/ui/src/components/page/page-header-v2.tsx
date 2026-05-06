import { type FC, type ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { Breadcrumb, type BreadcrumbItems } from '../breadcrumb'
import { IconV2, type IconV2NamesType } from '../icon-v2'
import { Layout } from '../layout'
import { Skeleton } from '../skeletons'
import { Tabs } from '../tabs'
import { Text } from '../text'

export interface HeaderV2TabItem {
  label: string
  value: string
  icon?: IconV2NamesType
  counter?: number
  disabled?: boolean
}

export interface PageHeaderV2Props {
  breadcrumbs?: BreadcrumbItems
  title: string | ReactNode
  iconName?: IconV2NamesType
  iconSize?: 'sm' | 'md' | 'lg' | 'xl'
  description?: string
  actions?: ReactNode
  tabs?: HeaderV2TabItem[]
  isLoading?: boolean
  children?: ReactNode
  className?: string
}

interface TitleSectionProps {
  title: string | ReactNode
  iconName?: IconV2NamesType
  iconSize: 'sm' | 'md' | 'lg' | 'xl'
  description?: string
  actions?: ReactNode
  isLoading?: boolean
}

const TitleSection: FC<TitleSectionProps> = ({ title, iconName, iconSize, description, actions, isLoading }) => {
  const titleElement =
    typeof title === 'string' ? (
      <Text as="h1" variant="heading-hero" truncate>
        {title}
      </Text>
    ) : (
      title
    )

  return (
    <Layout.Vertical gap="xs">
      <Layout.Horizontal align="center">
        <Layout.Horizontal gap="xs" align="center" className="min-w-0 flex-1">
          {iconName && <IconV2 name={iconName} size={iconSize} />}
          {titleElement}
        </Layout.Horizontal>
        {!isLoading && actions && (
          <Layout.Horizontal gap="xs" align="center">
            {actions}
          </Layout.Horizontal>
        )}
      </Layout.Horizontal>
      {isLoading && description !== undefined && <Skeleton.Box className="h-5 w-96" />}
      {!isLoading && description && <Text color="foreground-3">{description}</Text>}
    </Layout.Vertical>
  )
}

const TabsSection: FC<{ items: HeaderV2TabItem[] }> = ({ items }) => {
  return (
    <Tabs.List variant="underlined">
      {items.map(tab => (
        <Tabs.Trigger key={tab.value} value={tab.value} icon={tab.icon} counter={tab.counter} disabled={tab.disabled}>
          {tab.label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  )
}

export const HeaderV2: FC<PageHeaderV2Props> = ({
  title,
  iconName,
  iconSize = 'xl',
  description,
  actions,
  breadcrumbs,
  tabs,
  isLoading = false,
  children,
  className
}) => {
  return (
    <Layout.Vertical gap="lg" className={cn('w-full', tabs ? 'mb-0' : 'mb-cn-lg', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb.Nav items={breadcrumbs} />}
      <TitleSection
        title={title}
        iconName={iconName}
        iconSize={iconSize}
        description={description}
        actions={actions}
        isLoading={isLoading}
      />
      {(children || tabs) && (
        <Layout.Vertical gap="none">
          {children}
          {tabs && tabs.length > 0 && <TabsSection items={tabs} />}
        </Layout.Vertical>
      )}
    </Layout.Vertical>
  )
}
HeaderV2.displayName = 'PageHeaderV2'
